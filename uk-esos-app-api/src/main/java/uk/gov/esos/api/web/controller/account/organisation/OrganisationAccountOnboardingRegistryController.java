package uk.gov.esos.api.web.controller.account.organisation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;

import static uk.gov.esos.api.web.constants.SwaggerApiInfo.BAD_REQUEST;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.FORBIDDEN;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.NO_CONTENT;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.OK;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uk.gov.esos.api.account.organisation.onboarding.domain.OnboardingEmailsDTO;
import uk.gov.esos.api.account.organisation.onboarding.domain.OnboardingRegistrationNumberDTO;
import uk.gov.esos.api.account.organisation.onboarding.domain.OnboardingRegistrationNumbersDTO;
import uk.gov.esos.api.account.organisation.onboarding.domain.OrganisationAccountOnboardingRegistryDTO;
import uk.gov.esos.api.account.organisation.onboarding.service.OrganisationAccountOnboardingRegistryQueryService;
import uk.gov.esos.api.account.organisation.onboarding.service.OrganisationAccountOnboardingRegistryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.security.Authorized;

@RestController
@Validated
@RequestMapping(path = "/v1.0/organisation/account-onboarding")
@RequiredArgsConstructor
@Tag(name = "Organisation account onboarding registries")
public class OrganisationAccountOnboardingRegistryController {

    private final OrganisationAccountOnboardingRegistryQueryService queryService;
    private final OrganisationAccountOnboardingRegistryService service;

    @GetMapping("/registration-number")
    @Operation(summary = "Retrieve the registration number that corresponds to the given email (if exists)")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = OnboardingRegistrationNumberDTO.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    public ResponseEntity<OnboardingRegistrationNumberDTO> getCurrentUserVerifiedRegistrationNumber(@Parameter(hidden = true) AppUser appUser) {
        OnboardingRegistrationNumberDTO onboardingRegistrationNumberDTO =
            queryService.getRegistrationNumberByEmail(appUser.getEmail()).map(OnboardingRegistrationNumberDTO::new).orElse(null);
        return new ResponseEntity<>(onboardingRegistrationNumberDTO, HttpStatus.OK);
    }
    
    @PostMapping("/emails")
    @Operation(summary = "Retrieves email addresses that already exist in onboarding registry")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = OnboardingEmailsDTO.class))})
	@ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
	@Authorized
	public ResponseEntity<OnboardingEmailsDTO> getExistingVerifiedEmails(
			@RequestBody @Valid @Parameter(description = "The emails to be verified", required = true) OnboardingEmailsDTO emailsDTO) {
		OnboardingEmailsDTO onboardingEmailsDTO = OnboardingEmailsDTO.builder()
				.emails(queryService.getExistingEmails(emailsDTO.getEmails()))
				.build();
        return new ResponseEntity<>(onboardingEmailsDTO, HttpStatus.OK);
    }
	
	@PostMapping("/registration-numbers")
    @Operation(summary = "Retrieves registration numbers that already exist in onboarding registry")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = OnboardingRegistrationNumbersDTO.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
	@Authorized
	public ResponseEntity<OnboardingRegistrationNumbersDTO> getExistingVerifiedRegistrationNumbers(
			@RequestBody @Valid @Parameter(description = "The registration numbers to be verified", required = true) OnboardingRegistrationNumbersDTO registrationNumbersDTO) {
		OnboardingRegistrationNumbersDTO onboardingRegistrationNumbersDTO = OnboardingRegistrationNumbersDTO.builder()
				.registrationNumbers(queryService.getExistingRegistrationNumbers(registrationNumbersDTO.getRegistrationNumbers()))
				.build();
        return new ResponseEntity<>(onboardingRegistrationNumbersDTO, HttpStatus.OK);
    }
	
	@PostMapping
    @Operation(summary = "Adds list of verified organisation accounts in the onboarding registry")
	@ApiResponse(responseCode = "204", description = NO_CONTENT)
	@ApiResponse(responseCode = "400", description = BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
	@ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
	@Authorized
	public ResponseEntity<Void> addOrganisationAccountOnboardingRegistries(
			@Parameter(hidden = true) AppUser appUser,
			@RequestBody @Valid @NotEmpty @Parameter(description = "The verified accounts to be added", required = true) List<OrganisationAccountOnboardingRegistryDTO> verifiedAccounts) {
		service.addOrganisationAccountOnboardingRegistries(verifiedAccounts, appUser);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
