package uk.gov.esos.api.web.controller.account;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.esos.api.account.client.domain.dto.CompanyProfileDTO;
import uk.gov.esos.api.account.client.service.CompanyInformationService;
import uk.gov.esos.api.web.constants.SwaggerApiInfo;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;

import static uk.gov.esos.api.web.constants.SwaggerApiInfo.FORBIDDEN;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.NOT_FOUND;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.OK;

@RestController
@RequestMapping(path = "/v1.0/company-information/")
@RequiredArgsConstructor
@Tag(name = "Companies information")
public class CompanyInformationController {

    private final CompanyInformationService companyInformationService;

    @GetMapping("/{registrationNumber}")
    @Operation(summary = "Retrieves information about the company that corresponds to the provided registration number")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CompanyProfileDTO.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "503", description = SwaggerApiInfo.GET_COMPANY_PROFILE_SERVICE_UNAVAILABLE, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    public ResponseEntity<CompanyProfileDTO> getCompanyProfileByRegistrationNumber(
        @Parameter(description = "The registration number") @PathVariable("registrationNumber") @NotBlank @Size(min = 8, max = 8) String registrationNumber) {
        return new ResponseEntity<>(companyInformationService.getCompanyProfile(registrationNumber), HttpStatus.OK);
    }
}
