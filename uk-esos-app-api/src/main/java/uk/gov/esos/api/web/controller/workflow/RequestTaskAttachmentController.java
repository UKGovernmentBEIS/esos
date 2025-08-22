package uk.gov.esos.api.web.controller.workflow;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.common.domain.dto.FileUuidDTO;
import uk.gov.esos.api.token.FileToken;
import uk.gov.esos.api.web.constants.SwaggerApiInfo;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.security.Authorized;
import uk.gov.esos.api.web.util.FileDtoMapper;
import uk.gov.esos.api.workflow.request.application.attachment.task.RequestTaskAttachmentActionProcessDTO;
import uk.gov.esos.api.workflow.request.application.attachment.task.RequestTaskAttachmentService;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestTaskAttachmentUploadService;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping(path = "/v1.0/task-attachments")
@Tag(name = "Request task attachments handling")
@RequiredArgsConstructor
@Validated
public class RequestTaskAttachmentController {

    private final RequestTaskAttachmentUploadService requestTaskAttachmentUploadService;
    private final RequestTaskAttachmentService requestTaskAttachmentService;
    private final FileDtoMapper fileDtoMapper = Mappers.getMapper(FileDtoMapper.class);

    @PostMapping(path = "/upload", consumes = {"multipart/form-data"})
    @Operation(summary = "Upload a request task attachment")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FileUuidDTO.class))})
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.REQUEST_TASK_UPLOAD_ATTACHMENT_ACTION_BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#requestTaskAttachmentActionProcessDTO.requestTaskId")
    public ResponseEntity<FileUuidDTO> uploadRequestTaskAttachment(
            @Parameter(hidden = true) AppUser authUser,
            @RequestPart("requestTaskActionDetails") @Valid @Parameter(description = "The request task attachment properties", required = true)
                    RequestTaskAttachmentActionProcessDTO requestTaskAttachmentActionProcessDTO,
            @RequestPart("attachment") @Parameter(description = "The request task source file attachment", required = true)
                    MultipartFile file) throws IOException {
        FileDTO attachment = fileDtoMapper.toFileDTO(file);
        RequestTaskActionType requestTaskActionType = requestTaskAttachmentActionProcessDTO.getRequestTaskActionType();

        FileUuidDTO fileUuidDTO = requestTaskAttachmentUploadService
                .uploadAttachment(requestTaskAttachmentActionProcessDTO.getRequestTaskId(), requestTaskActionType, authUser, attachment);

        return new ResponseEntity<>(fileUuidDTO, HttpStatus.OK);
    }

    @GetMapping(path = "/{id}")
    @Operation(summary = "Generate the token to get the file with the provided uuid that belongs to the provided task")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FileToken.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#requestTaskId")
    public ResponseEntity<FileToken> generateRequestTaskGetFileAttachmentToken(
            @PathVariable("id") @Parameter(description = "The request task id") Long requestTaskId,
            @RequestParam("attachmentUuid") @Parameter(name = "attachmentUuid", description = "The attachment uuid") @NotNull UUID attachmentUuid) {
        FileToken getFileAttachmentToken =
                requestTaskAttachmentService.generateGetFileAttachmentToken(requestTaskId, attachmentUuid);
        return new ResponseEntity<>(getFileAttachmentToken, HttpStatus.OK);
    }
}
