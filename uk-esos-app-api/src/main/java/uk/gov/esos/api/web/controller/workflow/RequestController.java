package uk.gov.esos.api.web.controller.workflow;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.web.constants.SwaggerApiInfo;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.security.Authorized;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestCreateActionProcessDTO;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestCreateActionProcessResponseDTO;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestDetailsSearchResults;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestSearchByAccountCriteria;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflow.request.core.transform.RequestSearchCriteriaMapper;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestCreateActionHandlerMapper;

import static uk.gov.esos.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.NOT_FOUND;

@Validated
@RestController
@RequestMapping(path = "/v1.0/requests")
@Tag(name = "Requests")
@RequiredArgsConstructor
public class RequestController {

    private final RequestCreateActionHandlerMapper requestCreateActionHandlerMapper;
    private final RequestQueryService requestQueryService;
    private final RequestSearchCriteriaMapper requestSearchCriteriaMapper = Mappers.getMapper(RequestSearchCriteriaMapper.class);

    @PostMapping
    @SuppressWarnings("unchecked")
    @Operation(summary = "Processes a request create action")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = RequestCreateActionProcessResponseDTO.class))})
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.REQUEST_ACTION_BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "503", description = SwaggerApiInfo.GET_COMPANY_PROFILE_SERVICE_UNAVAILABLE, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
// TODO remove for now update it later.
    @Authorized(resourceId = "#accountId", resourceSubType = "#requestCreateActionProcess.requestCreateActionType")
    public ResponseEntity<RequestCreateActionProcessResponseDTO> processRequestCreateAction(@Parameter(hidden = true) AppUser appUser,
                                                                                            @RequestParam(required = false) @Parameter(name = "accountId", description = "The account id", required = false) Long accountId,
                                                                                            @RequestBody @Valid @Parameter(description = "The request create action body", required = true) RequestCreateActionProcessDTO requestCreateActionProcess) {
        String requestId = requestCreateActionHandlerMapper
                .get(requestCreateActionProcess.getRequestCreateActionType())
                .process(accountId, requestCreateActionProcess.getRequestCreateActionType(),
                        requestCreateActionProcess.getRequestCreateActionPayload(), appUser);
        return ResponseEntity.ok(new RequestCreateActionProcessResponseDTO(requestId));
    }

    @GetMapping(path = "/{id}")
    @Operation(summary = "Get request details by id")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = RequestDetailsDTO.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#id")
    public ResponseEntity<RequestDetailsDTO> getRequestDetailsById(
            @PathVariable("id") @Parameter(description = "The request id") String id){
        return new ResponseEntity<>(requestQueryService.findRequestDetailsById(id), HttpStatus.OK);
    }

    @PostMapping("/workflows") //workaround: post instead of get, in order to support posting collection of params (request types)
    @Operation(summary = "Get the workflows for the given search criteria")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = RequestDetailsSearchResults.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#criteria.accountId")
    public ResponseEntity<RequestDetailsSearchResults> getRequestDetailsByAccountId(
            @RequestBody @Valid @Parameter(description = "The search criteria", required = true) RequestSearchByAccountCriteria criteria){
        return new ResponseEntity<>(requestQueryService.findRequestDetailsBySearchCriteria(requestSearchCriteriaMapper.toRequestSearchCriteria(criteria)), HttpStatus.OK);
    }
}
