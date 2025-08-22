package uk.gov.esos.api.account.organisation.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uk.gov.esos.api.account.domain.dto.AccountSearchCriteria;
import uk.gov.esos.api.account.organisation.domain.ClassificationCode;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.organisation.domain.dto.AccountSearchResults;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.repository.OrganisationAccountRepository;
import uk.gov.esos.api.account.organisation.transform.OrganisationAccountMapper;
import uk.gov.esos.api.account.service.VerifierAccountAccessByAccountTypeService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.services.resource.AccountAuthorizationResourceService;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganisationAccountQueryService {

    private final OrganisationAccountRepository repository;
    private final VerifierAccountAccessByAccountTypeService verifierAccountAccessService;
    private final AccountAuthorizationResourceService accountAuthorizationResourceService;

    private static final OrganisationAccountMapper organisationAccountMapper = Mappers.getMapper(OrganisationAccountMapper.class);

    public AccountSearchResults getAccountsByUserAndSearchCriteria(AppUser user, AccountSearchCriteria searchCriteria) {
        return switch (user.getRoleType()) {
            case OPERATOR -> repository.findByAccountIds(List.copyOf(user.getAccounts()), searchCriteria);
            case REGULATOR -> repository.findByCompAuth(user.getCompetentAuthority(), searchCriteria);
            case VERIFIER -> {
                final Set<Long> accounts = verifierAccountAccessService.findAuthorizedAccountIds(user, AccountType.ORGANISATION);
                if (accounts.isEmpty()) {
                	yield AccountSearchResults.builder().total(0L).accounts(List.of()).build();
                } else {
                    yield repository.findByAccountIds(new ArrayList<>(accounts), searchCriteria);
                }
            }
        };
    }

    @Transactional
    public OrganisationAccountDTO getOrganisationAccount(AppUser user, Long accountId) {
    	OrganisationAccountDTO accountDto = getOrganisationAccountById(accountId);
        accountDto.setEditable(user.getRoleType().equals(RoleType.OPERATOR) && 
        		accountAuthorizationResourceService.hasUserScopeToAccount(user, accountId, Scope.EDIT_ACCOUNT_DETAILS) &&
                !accountDto.getStatus().equals(OrganisationAccountStatus.CLOSED));
        return accountDto;
    }
    
    @Transactional
    public OrganisationAccountDTO getOrganisationAccountById(Long accountId) {
        OrganisationAccount account = getAccountById(accountId);
        OrganisationAccountDTO accountDTO = organisationAccountMapper.toOrganisationAccountDTO(account);
        accountDTO.setCodes(ClassificationCodes.builder()
    			.type(account.getClassificationCodes().get(0).getType())
    			.otherTypeName(account.getClassificationCodes().get(0).getName())
    			.codes(account.getClassificationCodes().stream().map(ClassificationCode::getCode).toList())
    			.build());
        return accountDTO;
    }

    public List<OrganisationAccountDTO> getAccountsByIds(List<Long> accountIds) {
        return repository.findAllByIdIn(accountIds)
            .stream()
            .map(organisationAccountMapper::toOrganisationAccountDTO)
            .collect(Collectors.toList());
    }

    OrganisationAccount getAccountById(Long accountId) {
        return repository.findById(accountId)
            .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    public OrganisationAccountDTO getOrganisationAccountDTOById(Long accountId) {
        return  organisationAccountMapper.toOrganisationAccountDTO(getAccountById(accountId));
    }

}
