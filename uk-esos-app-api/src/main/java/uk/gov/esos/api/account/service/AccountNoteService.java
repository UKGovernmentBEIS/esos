package uk.gov.esos.api.account.service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uk.gov.esos.api.account.domain.AccountNote;
import uk.gov.esos.api.account.domain.dto.AccountNoteDto;
import uk.gov.esos.api.account.domain.dto.AccountNoteRequest;
import uk.gov.esos.api.account.domain.dto.AccountNoteResponse;
import uk.gov.esos.api.account.repository.AccountNoteRepository;
import uk.gov.esos.api.account.transform.AccountNoteMapper;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.AccountNoteAuthorityInfoDTO;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.ResourceAuthorityInfo;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.providers.AccountNoteAuthorityInfoProvider;
import uk.gov.esos.api.authorization.rules.services.resource.AccountAuthorizationResourceService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.common.note.NotePayload;
import uk.gov.esos.api.common.note.NoteRequest;
import uk.gov.esos.api.common.service.DateService;
import uk.gov.esos.api.files.notes.service.FileNoteService;
import uk.gov.esos.api.files.notes.service.FileNoteTokenService;
import uk.gov.esos.api.token.FileToken;

@Service
@RequiredArgsConstructor
@Log4j2
public class AccountNoteService implements AccountNoteAuthorityInfoProvider {

    private final AccountNoteRepository accountNoteRepository;
    private final AccountAuthorizationResourceService accountAuthorizationResourceService;
    private final AccountNoteMapper accountNoteMapper;
    private final FileNoteService fileNoteService;
    private final FileNoteTokenService fileNoteTokenService;
    private final DateService dateService;
    
    public AccountNoteResponse getAccountNotesByAccountId(final AppUser appUser,
                                                          final Long accountId,
                                                          final Integer page,
                                                          final Integer pageSize) {
        this.cleanUpUnusedNoteFilesAsync();

        Page<AccountNote> accountNotePage;
        List<AccountNoteDto> accountNoteDtos;
        boolean hasPermissionToEditList = true;
        if(appUser.getRoleType().equals(RoleType.OPERATOR)) {
            accountNotePage = accountNoteRepository
                    .findAccountNotesByAccountIdAndRoleTypeOrderByLastUpdatedOnDesc(PageRequest.of(page, pageSize), accountId, appUser.getRoleType());
            final boolean hasEditPermission = accountAuthorizationResourceService
                    .hasUserScopeToAccount(appUser, accountId, Scope.EDIT_ACCOUNT_NOTE);
            hasPermissionToEditList = hasEditPermission;

            accountNoteDtos = accountNotePage.get()
                    .map(note -> accountNoteMapper.toAccountNoteDTO(note, hasEditPermission && note.getRoleType().equals(appUser.getRoleType())))
                    .toList();
        }
        else {
            accountNotePage = accountNoteRepository
                    .findAccountNotesByAccountIdOrderByLastUpdatedOnDesc(PageRequest.of(page, pageSize), accountId);

            accountNoteDtos = accountNotePage.get()
                    .map(note -> accountNoteMapper.toAccountNoteDTO(note, note.getRoleType().equals(appUser.getRoleType())))
                    .toList();
        }

        return AccountNoteResponse.builder()
                .accountNotes(accountNoteDtos)
                .totalItems(accountNotePage.getTotalElements())
                .hasUserEditPermission(hasPermissionToEditList)
                .build();
    }

    public AccountNoteDto getNote(final AppUser appUser, final Long id) {
        AccountNote note = accountNoteRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        if(appUser.getRoleType().equals(RoleType.OPERATOR)) {
            final boolean hasEditPermission = accountAuthorizationResourceService
                    .hasUserScopeToAccount(appUser, note.getAccountId(), Scope.EDIT_ACCOUNT_NOTE);

            return accountNoteMapper.toAccountNoteDTO(note, hasEditPermission && note.getRoleType().equals(appUser.getRoleType()));
        }
        else {
            return accountNoteMapper.toAccountNoteDTO(note, note.getRoleType().equals(appUser.getRoleType()));
        }
    }
    
    @Transactional
    public void createNote(final AppUser authUser, final AccountNoteRequest accountNoteRequest) {
        final AccountNote accountNote = this.buildAccountNote(accountNoteRequest, authUser);
        accountNoteRepository.save(accountNote);

        final Set<UUID> filesUuids = accountNoteRequest.getFiles();
        fileNoteService.submitFiles(filesUuids);
    }

    @Transactional
    public void updateNote(final Long noteId, final NoteRequest noteRequest, final AppUser authUser) {
        final AccountNote accountNote = accountNoteRepository.findById(noteId)
            .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        final Set<UUID> previousFiles = accountNote.getPayload().getFiles().keySet();
        final Set<UUID> currentFiles = noteRequest.getFiles();
        final HashSet<UUID> deletedFiles = new HashSet<>(previousFiles);
        deletedFiles.removeAll(currentFiles);
        if (!deletedFiles.isEmpty()) {
            fileNoteService.deleteFiles(deletedFiles);
        }
        
        final Map<UUID, String> newFileNames = this.getFileNames(currentFiles);

        accountNote.getPayload().setNote(noteRequest.getNote());
        accountNote.getPayload().setFiles(newFileNames);
        accountNote.setSubmitterId(authUser.getUserId());
        accountNote.setSubmitter(authUser.getFirstName() + " " + authUser.getLastName());
        accountNote.setLastUpdatedOn(dateService.getLocalDateTime());
        fileNoteService.submitFiles(currentFiles);
    }

    @Transactional
    public void deleteNote(final Long noteId) {
        final AccountNote accountNote = accountNoteRepository.findById(noteId)
            .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        accountNoteRepository.deleteById(noteId);
        
        final Set<UUID> files = accountNote.getPayload().getFiles().keySet();
        if (!files.isEmpty()) {
            fileNoteService.deleteFiles(files);
        }
    }

    @Override
    public AccountNoteAuthorityInfoDTO getAccountNoteAuthorityInfo(final Long id) {
        return accountNoteRepository.findById(id)
                .map(note ->
                        AccountNoteAuthorityInfoDTO.builder()
                                .resourceSubType(note.getRoleType().toString())
                                .authorityInfo(ResourceAuthorityInfo.builder().accountId(note.getAccountId()).build())
                                .build())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    public FileToken generateGetFileNoteToken(final Long accountId, final UUID fileUuid) {
        return fileNoteTokenService.generateGetAccountFileNoteToken(accountId, fileUuid);
    }

    private void cleanUpUnusedNoteFilesAsync() {
        CompletableFuture.runAsync(fileNoteService::cleanUpUnusedFiles)
            .exceptionally(ex -> {
                log.error(ex);
                return null;
            });
    }

    private AccountNote buildAccountNote(final AccountNoteRequest accountNoteRequest, final AppUser authUser) {
        final Map<UUID, String> fileNames = this.getFileNames(accountNoteRequest.getFiles());

        return AccountNote.builder()
            .accountId(accountNoteRequest.getAccountId())
            .payload(NotePayload.builder()
                .note(accountNoteRequest.getNote())
                .files(fileNames)
                .build())
            .submitterId(authUser.getUserId())
            .submitter(authUser.getFirstName() + " " + authUser.getLastName())
            .lastUpdatedOn(dateService.getLocalDateTime())
            .roleType(authUser.getRoleType())
            .build();
    }

    private Map<UUID, String> getFileNames(final Set<UUID> filesUuids) {
        final Map<UUID, String> fileNames = fileNoteService.getFileNames(filesUuids);
        final int filesFound = fileNames.size();
        if (filesFound != filesUuids.size()) {
            throw new BusinessException(ErrorCode.FORM_VALIDATION);
        }
        return fileNames;
    }
}
