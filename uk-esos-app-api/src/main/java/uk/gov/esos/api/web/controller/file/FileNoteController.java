package uk.gov.esos.api.web.controller.file;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.notes.service.FileNoteTokenService;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;

import jakarta.validation.constraints.NotEmpty;

import java.nio.charset.StandardCharsets;

import static uk.gov.esos.api.web.constants.SwaggerApiInfo.BAD_REQUEST;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.NOT_FOUND;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.OK;

@RestController
@RequestMapping(path = "/v1.0/file-notes")
@RequiredArgsConstructor
@Tag(name = "File Notes")
public class FileNoteController {

    private final FileNoteTokenService fileNoteTokenService;
    
    
    @GetMapping(path = "/{token}")
    @Operation(summary = "Get the file note resource for the provided file token")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = Resource.class))})
    @ApiResponse(responseCode = "400", description = BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    public ResponseEntity<Resource> getFileNote(
        @PathVariable("token") @Parameter(description = "The file note token", required = true) @NotEmpty String token) {
        
        final FileDTO file = fileNoteTokenService.getFileDTOByToken(token);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition.builder("note").filename(file.getFileName(), StandardCharsets.UTF_8).build().toString())
            .contentType(MediaType.parseMediaType(file.getFileType()))
            .body(new ByteArrayResource(file.getFileContent()));
    }
}
