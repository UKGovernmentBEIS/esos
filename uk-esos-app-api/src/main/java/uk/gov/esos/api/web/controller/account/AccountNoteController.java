package uk.gov.esos.api.web.controller.account;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import uk.gov.esos.api.account.domain.dto.AccountNoteDto;
import uk.gov.esos.api.account.domain.dto.AccountNoteRequest;
import uk.gov.esos.api.account.domain.dto.AccountNoteResponse;
import uk.gov.esos.api.account.service.AccountNoteService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.note.NoteRequest;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.common.domain.dto.FileUuidDTO;
import uk.gov.esos.api.files.notes.service.FileNoteService;
import uk.gov.esos.api.token.FileToken;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.security.Authorized;
import uk.gov.esos.api.web.util.FileDtoMapper;

import java.io.IOException;
import java.util.UUID;

import static uk.gov.esos.api.web.constants.SwaggerApiInfo.BAD_REQUEST;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.FORBIDDEN;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.NOT_FOUND;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.NO_CONTENT;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.OK;

@RestController
@RequestMapping(path = "/v1.0/account-notes")
@Tag(name = "Account Notes")
@RequiredArgsConstructor
@Validated
public class AccountNoteController {

    private final AccountNoteService accountNoteService;
    private final FileDtoMapper fileDtoMapper = Mappers.getMapper(FileDtoMapper.class);
    private final FileNoteService fileNoteService;

    @GetMapping
    @Operation(summary = "Retrieves the notes for account id")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = AccountNoteResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<AccountNoteResponse> getNotesByAccountId(
            @Parameter(hidden = true) AppUser appUser,
            @RequestParam("accountId") @Parameter(name = "accountId", description = "The account id") Long accountId,
            @RequestParam("page") @Parameter(name = "page", description = "The page number starting from zero")
            @Min(value = 0, message = "{parameter.page.typeMismatch}")
            @NotNull(message = "{parameter.page.typeMismatch}") Integer page,
            @RequestParam("size") @Parameter(name = "size", description = "The page size")
            @Min(value = 1, message = "{parameter.pageSize.typeMismatch}")
            @NotNull(message = "{parameter.pageSize.typeMismatch}") Integer pageSize) {

        return new ResponseEntity<>(
                accountNoteService.getAccountNotesByAccountId(appUser, accountId, page, pageSize),
                HttpStatus.OK
        );
    }

    @GetMapping(path = "/{id}")
    @Operation(summary = "Get an account note")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = AccountNoteDto.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#id")
    public ResponseEntity<AccountNoteDto> getAccountNote(
            @Parameter(hidden = true) AppUser appUser,
            @PathVariable("id") @Parameter(description = "The note id") Long id) {
        final AccountNoteDto accountNoteDto = accountNoteService.getNote(appUser, id);
        return new ResponseEntity<>(accountNoteDto, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Creates a new account note")
    @ApiResponse(responseCode = "204", description = NO_CONTENT)
    @ApiResponse(responseCode = "400", description = BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountNoteRequest.accountId")
    public ResponseEntity<Void> createAccountNote(@Parameter(hidden = true) AppUser authUser,
                                                  @RequestBody
                                                  @Valid
                                                  @Parameter(description = "The account note request", required = true)
                                                          AccountNoteRequest accountNoteRequest) {

        accountNoteService.createNote(authUser, accountNoteRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping(path = "/upload/account/{accountId}", consumes = {"multipart/form-data"})
    @Operation(summary = "Upload a note file")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FileUuidDTO.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<FileUuidDTO> uploadAccountNoteFile(
            @Parameter(hidden = true) AppUser authUser,
            @PathVariable("accountId") @Parameter(description = "The account id") Long accountId,
            @RequestPart("file") @Parameter(description = "The note file", required = true)
                    MultipartFile file) throws IOException {

        final FileDTO fileDTO = fileDtoMapper.toFileDTO(file);
        final FileUuidDTO fileUuidDTO = fileNoteService.uploadAccountFile(authUser, fileDTO, accountId);

        return new ResponseEntity<>(fileUuidDTO, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an account note")
    @ApiResponse(responseCode = "200", description = OK)
    @ApiResponse(responseCode = "400", description = BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#id")
    public ResponseEntity<Void> updateAccountNote(
            @Parameter(hidden = true) AppUser authUser,
            @PathVariable("id") @Parameter(description = "The note id") Long id,
            @RequestBody @Valid @Parameter(description = "The note request", required = true) NoteRequest noteRequest) {

        accountNoteService.updateNote(id, noteRequest, authUser);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an account note")
    @ApiResponse(responseCode = "200", description = OK)
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#id")
    public ResponseEntity<Void> deleteAccountNote(@PathVariable("id") @Parameter(description = "The note id") Long id) {
        accountNoteService.deleteNote(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping(path = "/{accountId}/files")
    @Operation(summary = "Generate the token to get the file that belongs to the provided account note id")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FileToken.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<FileToken> generateGetAccountFileNoteToken(
        @PathVariable("accountId") @Parameter(description = "The account id") @NotNull Long accountId,
        @RequestParam("uuid") @Parameter(description = "The note file uuid") @NotNull UUID fileUuid) {
        
        final FileToken fileToken = accountNoteService.generateGetFileNoteToken(accountId, fileUuid);
        return new ResponseEntity<>(fileToken, HttpStatus.OK);
    }
}
