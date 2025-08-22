package uk.gov.esos.api.web.controller.mireport;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.orchestrator.mireport.dto.NotificationOfCompliancesP3MiReportResult;
import uk.gov.esos.api.web.orchestrator.mireport.service.NotificationOfCompliancesMiReportQueryOrchestrator;
import uk.gov.esos.api.web.security.AuthorizedRole;

import static uk.gov.esos.api.common.domain.enumeration.RoleType.REGULATOR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.OK;

@RestController
@RequestMapping(path = "/v1.0/{accountType}/mireports/noc")
@RequiredArgsConstructor
@Tag(name = "NOC Reports")
@Validated
public class NocReportController {

    private final NotificationOfCompliancesMiReportQueryOrchestrator notificationOfCompliancesMiReportQueryOrchestrator;

    @GetMapping("/phase-3")
    @Operation(summary = "Retrieves the report for all submitted noc")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = NotificationOfCompliancesP3MiReportResult.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = {REGULATOR})
    public ResponseEntity<NotificationOfCompliancesP3MiReportResult> generateNocP3Report(
            @PathVariable("accountType") @Parameter(description = "The account type") AccountType accountType,
            @RequestParam("page") @Parameter(name = "page", description = "The page number starting from zero")
            @Min(value = 0, message = "{parameter.page.typeMismatch}")
            @NotNull(message = "{parameter.page.typeMismatch}") Long page,
            @RequestParam("size") @Parameter(name = "size", description = "The page size")
            @Min(value = 1, message = "{parameter.pageSize.typeMismatch}")
            @NotNull(message = "{parameter.pageSize.typeMismatch}") Long pageSize) {

        NotificationOfCompliancesP3MiReportResult result = notificationOfCompliancesMiReportQueryOrchestrator
                .generateP3(accountType, page, pageSize);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
