package uk.gov.esos.api.web.controller.workflow;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.web.constants.SwaggerApiInfo;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.security.Authorized;
import uk.gov.esos.api.workflow.request.application.taskview.RequestTaskItemDTO;
import uk.gov.esos.api.workflow.request.application.taskview.RequestTaskViewService;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestTaskActionProcessDTO;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandlerMapper;

import static uk.gov.esos.api.web.constants.SwaggerApiInfo.FORBIDDEN;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.NOT_FOUND;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.NO_CONTENT;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.OK;

@RestController
@RequestMapping(path = "/v1.0/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks")
public class RequestTaskController {

    private final RequestTaskViewService requestTaskViewService;
    private final RequestTaskActionHandlerMapper requestTaskActionHandlerMapper;

    @GetMapping(path = "/{id}")
    @Operation(summary = "Get task item info by id")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = RequestTaskItemDTO.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#taskId")
    public ResponseEntity<RequestTaskItemDTO> getTaskItemInfoById(@Parameter(hidden = true) AppUser pmrvUser,
                                                                  @PathVariable("id") @Parameter(description = "The task id") Long taskId) {
        final RequestTaskItemDTO taskItem = requestTaskViewService.getTaskItemInfo(taskId, pmrvUser);
        return new ResponseEntity<>(taskItem, HttpStatus.OK);
    }

    @SuppressWarnings("unchecked")
    @PostMapping(path = "/actions")
    @Operation(summary = "Processes a request task action")
    @ApiResponse(responseCode = "204", description = NO_CONTENT)
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.REQUEST_TASK_ACTION_BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "503", description = SwaggerApiInfo.GET_COMPANY_PROFILE_SERVICE_UNAVAILABLE, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#requestTaskActionProcessDTO.requestTaskId")
    public ResponseEntity<Void> processRequestTaskAction(@Parameter(hidden = true) AppUser pmrvUser,
                                                         @RequestBody @Valid @Parameter(description = "The request task action body", required = true) RequestTaskActionProcessDTO requestTaskActionProcessDTO) {
        requestTaskActionHandlerMapper
                .get(requestTaskActionProcessDTO.getRequestTaskActionType())
                .process(requestTaskActionProcessDTO.getRequestTaskId(),
                        requestTaskActionProcessDTO.getRequestTaskActionType(),
                        pmrvUser,
                        requestTaskActionProcessDTO.getRequestTaskActionPayload());

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
