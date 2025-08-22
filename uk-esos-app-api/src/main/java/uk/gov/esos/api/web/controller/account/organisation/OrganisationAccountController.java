package uk.gov.esos.api.web.controller.account.organisation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.esos.api.account.domain.dto.AccountSearchCriteria;
import uk.gov.esos.api.account.organisation.domain.dto.AccountSearchResults;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountQueryService;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountValidationService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.security.AuthorizedRole;

import static uk.gov.esos.api.common.domain.enumeration.RoleType.OPERATOR;
import static uk.gov.esos.api.common.domain.enumeration.RoleType.REGULATOR;
import static uk.gov.esos.api.common.domain.enumeration.RoleType.VERIFIER;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.OK;

@RestController
@Validated
@RequestMapping(path = "/v1.0/organisation/accounts")
@RequiredArgsConstructor
@Tag(name = "Organisation accounts")
public class OrganisationAccountController {

    private final OrganisationAccountQueryService queryService;
    private final OrganisationAccountValidationService validationService;

    @GetMapping
    @Operation(summary = "Retrieves the current user associated organisation accounts")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = AccountSearchResults.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = {OPERATOR, REGULATOR, VERIFIER})
    public ResponseEntity<AccountSearchResults> getCurrentUserOrganisationAccounts(
            @Parameter(hidden = true) AppUser user,
            @RequestParam(value = "term", required = false) @Size(min = 3, max = 256) @Parameter(description = "The term to search") String term,
            @RequestParam(value = "page") @NotNull @Parameter(description = "The page number starting from zero") @Min(value = 0, message = "{parameter.page.typeMismatch}") Long page,
            @RequestParam(value = "size") @NotNull @Parameter(description = "The page size") @Min(value = 1, message = "{parameter.pageSize.typeMismatch}") Long pageSize
    ) {
        return new ResponseEntity<>(
                queryService.getAccountsByUserAndSearchCriteria(user,
                        AccountSearchCriteria.builder()
                                .term(term)
                                .paging(PagingRequest.builder().pageNumber(page).pageSize(pageSize).build())
                                .build()),
                HttpStatus.OK);
    }

    @GetMapping("/registration-number")
    @Operation(summary = "Checks if exists active account with the provided registration number")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = Boolean.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    public ResponseEntity<Boolean> isExistingAccountRegistrationNumber(
        @RequestParam("reg_nbr") @Parameter(name ="reg_nbr", description = "The registration number", required = true) @NotBlank String registrationNumber) {
        return new ResponseEntity<>(validationService.isExistingActiveAccountRegistrationNumber(registrationNumber), HttpStatus.OK);
    }

}
