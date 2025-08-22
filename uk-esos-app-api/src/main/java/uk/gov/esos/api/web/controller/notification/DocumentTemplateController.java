package uk.gov.esos.api.web.controller.notification;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.notification.template.domain.dto.DocumentTemplateDTO;
import uk.gov.esos.api.notification.template.domain.dto.DocumentTemplateSearchCriteria;
import uk.gov.esos.api.notification.template.domain.dto.TemplateSearchResults;
import uk.gov.esos.api.notification.template.service.DocumentTemplateQueryService;
import uk.gov.esos.api.notification.template.service.DocumentTemplateUpdateService;
import uk.gov.esos.api.web.constants.SwaggerApiInfo;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.security.Authorized;
import uk.gov.esos.api.web.security.AuthorizedRole;
import uk.gov.esos.api.web.util.FileDtoMapper;

import java.io.IOException;

import static uk.gov.esos.api.common.domain.enumeration.RoleType.REGULATOR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.OK;

@RestController
@Validated
@RequiredArgsConstructor
@Tag(name = "Document Templates")
public class DocumentTemplateController {

    private final DocumentTemplateQueryService documentTemplateQueryService;
    private final DocumentTemplateUpdateService documentTemplateUpdateService;
    private final FileDtoMapper fileDtoMapper = Mappers.getMapper(FileDtoMapper.class);

    @GetMapping(path = "/v1.0/{accountType}/document-templates")
    @Operation(summary = "Retrieves the document templates associated with current user")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = TemplateSearchResults.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = REGULATOR)
    public ResponseEntity<TemplateSearchResults> getCurrentUserDocumentTemplates(
            @Parameter(hidden = true) AppUser pmrvUser,
            @PathVariable("accountType") @Parameter(description = "The account type") AccountType accountType,
            @RequestParam(value = "term", required = false) @Size(min = 3, max = 256) @Parameter(name = "term", description = "The term to search") String term,
            @RequestParam(value = "page") @NotNull @Parameter(name = "page", description = "The page number starting from zero") @Min(value = 0, message = "{parameter.page.typeMismatch}") Long page,
            @RequestParam(value = "size") @NotNull @Parameter(name = "size", description = "The page size") @Min(value = 1, message = "{parameter.pageSize.typeMismatch}") Long pageSize
    ) {
        return new ResponseEntity<>(
                documentTemplateQueryService.getDocumentTemplatesBySearchCriteria(
                        DocumentTemplateSearchCriteria.builder()
                                .competentAuthority(pmrvUser.getCompetentAuthority())
                                .accountType(accountType)
                                .term(term)
                                .paging(PagingRequest.builder().pageNumber(page).pageSize(pageSize).build())
                                .build()
                ),
                HttpStatus.OK);
    }

    @GetMapping(path = "/v1.0/document-templates/{id}")
    @Operation(summary = "Retrieves the document template with the provided id")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = DocumentTemplateDTO.class))})
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.GET_DOCUMENT_TEMPLATE_BY_ID_BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#id")
    public ResponseEntity<DocumentTemplateDTO> getDocumentTemplateById(
            @Parameter(description = "The document template id") @PathVariable("id") Long id) {
        return new ResponseEntity<>(documentTemplateQueryService.getDocumentTemplateDTOById(id), HttpStatus.OK);
    }

    @PostMapping(path = "/v1.0/document-templates/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @Operation(summary = "Updates the document template with the provided id")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.NO_CONTENT)
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.UPDATE_DOCUMENT_TEMPLATE_BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#id")
    public ResponseEntity<Void> updateDocumentTemplate(
            @Parameter(hidden = true) AppUser authUser,
            @PathVariable("id") @Parameter(description = "The document template id") Long id,
            @RequestPart("file") @Parameter(description = "The document template source file", required = true) MultipartFile documentFile) throws IOException {
        FileDTO documentFileDTO = fileDtoMapper.toFileDTO(documentFile);
        documentTemplateUpdateService.updateDocumentTemplateFile(id, documentFileDTO, authUser.getUserId());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
