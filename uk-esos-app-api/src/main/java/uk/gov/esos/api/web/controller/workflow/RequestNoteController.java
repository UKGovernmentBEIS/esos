package uk.gov.esos.api.web.controller.workflow;

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
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.note.NoteRequest;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.common.domain.dto.FileUuidDTO;
import uk.gov.esos.api.files.notes.service.FileNoteService;
import uk.gov.esos.api.token.FileToken;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.security.Authorized;
import uk.gov.esos.api.web.util.FileDtoMapper;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestNoteDto;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestNoteRequest;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestNoteResponse;
import uk.gov.esos.api.workflow.request.core.service.RequestNoteService;

import java.io.IOException;
import java.util.UUID;

import static uk.gov.esos.api.web.constants.SwaggerApiInfo.BAD_REQUEST;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.FORBIDDEN;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.NOT_FOUND;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.NO_CONTENT;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.OK;

@RestController
@RequestMapping(path = "/v1.0/request-notes")
@Tag(name = "Request Notes")
@RequiredArgsConstructor
@Validated
public class RequestNoteController {

    private final RequestNoteService requestNoteService;
    private final FileDtoMapper fileDtoMapper = Mappers.getMapper(FileDtoMapper.class);
    private final FileNoteService fileNoteService;

    @GetMapping
    @Operation(summary = "Retrieves the notes for request id")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = RequestNoteResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#requestId")
    public ResponseEntity<RequestNoteResponse> getNotesByRequestId(
    		@Parameter(hidden = true) AppUser appUser,
            @RequestParam("requestId") @Parameter(name = "requestId", description = "The request id") String requestId,
            @RequestParam("page") @Parameter(name = "page", description = "The page number starting from zero")
            @Min(value = 0, message = "{parameter.page.typeMismatch}")
            @NotNull(message = "{parameter.page.typeMismatch}") Integer page,
            @RequestParam("size") @Parameter(name = "size", description = "The page size")
            @Min(value = 1, message = "{parameter.pageSize.typeMismatch}")
            @NotNull(message = "{parameter.pageSize.typeMismatch}") Integer pageSize) {

        return new ResponseEntity<>(
                requestNoteService.getRequestNotesByRequestId(appUser, requestId, page, pageSize),
                HttpStatus.OK
        );
    }

    @GetMapping(path = "/{id}")
    @Operation(summary = "Get a request note")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = RequestNoteDto.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#id")
    public ResponseEntity<RequestNoteDto> getRequestNote(
    		@PathVariable("id") @Parameter(description = "The note id") Long id,
    		@Parameter(hidden = true) AppUser appUser) {

        final RequestNoteDto requestNoteDto = requestNoteService.getNote(appUser, id);
        return new ResponseEntity<>(requestNoteDto, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Creates a new request note")
    @ApiResponse(responseCode = "204", description = NO_CONTENT)
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#requestNoteRequest.requestId")
    public ResponseEntity<Void> createRequestNote(@Parameter(hidden = true) AppUser authUser,
                                                  @RequestBody
                                                  @Valid
                                                  @Parameter(description = "The request note request", required = true)
                                                          RequestNoteRequest requestNoteRequest) {

        requestNoteService.createNote(authUser, requestNoteRequest);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping(path = "/upload/request/{requestId}", consumes = {"multipart/form-data"})
    @Operation(summary = "Upload a note file")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FileUuidDTO.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#requestId")
    public ResponseEntity<FileUuidDTO> uploadRequestNoteFile(
            @Parameter(hidden = true) AppUser authUser,
            @PathVariable("requestId") @Parameter(description = "The request id") String requestId,
            @RequestPart("file") @Parameter(description = "The note file", required = true)
                    MultipartFile file) throws IOException {

        final FileDTO fileDTO = fileDtoMapper.toFileDTO(file);
        final FileUuidDTO fileUuidDTO = fileNoteService.uploadRequestFile(authUser, fileDTO, requestId);

        return new ResponseEntity<>(fileUuidDTO, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a request note")
    @ApiResponse(responseCode = "204", description = NO_CONTENT)
    @ApiResponse(responseCode = "400", description = BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#id")
    public ResponseEntity<Void> updateRequestNote(
            @Parameter(hidden = true) AppUser authUser,
            @PathVariable("id") @Parameter(description = "The note id") Long id,
            @RequestBody @Valid @Parameter(description = "The note request", required = true) NoteRequest noteRequest) {

        requestNoteService.updateNote(id, noteRequest, authUser);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a request note")
    @ApiResponse(responseCode = "204", description = NO_CONTENT)
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#id")
    public ResponseEntity<Void> deleteRequestNote(@PathVariable("id") @Parameter(description = "The note id") Long id) {

        requestNoteService.deleteNote(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping(path = "/{requestId}/files")
    @Operation(summary = "Generate the token to get the file that belongs to the provided request note id")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FileToken.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#requestId")
    public ResponseEntity<FileToken> generateGetRequestFileNoteToken(
            @PathVariable("requestId") @Parameter(description = "The request id") @NotNull String requestId,
            @RequestParam("uuid") @Parameter(description = "The note file uuid") @NotNull UUID fileUuid) {

        final FileToken fileToken = requestNoteService.generateGetFileNoteToken(requestId, fileUuid);
        return new ResponseEntity<>(fileToken, HttpStatus.OK);
    }
}
