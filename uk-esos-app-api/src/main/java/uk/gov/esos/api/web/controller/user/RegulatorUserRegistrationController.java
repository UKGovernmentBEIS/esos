package uk.gov.esos.api.web.controller.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.user.core.domain.dto.TokenDTO;
import uk.gov.esos.api.user.regulator.service.RegulatorUserAcceptInvitationService;
import uk.gov.esos.api.web.constants.SwaggerApiInfo;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.security.AuthorizedRole;

@RestController
@RequestMapping(path = "/v1.0/regulator-users/registration")
@Tag(name = "Regulator users registration")
@SecurityRequirements
@RequiredArgsConstructor
@Log4j2
public class RegulatorUserRegistrationController {

    private final RegulatorUserAcceptInvitationService regulatorUserAcceptInvitationService;

    /** ONE-LOGIN endpoints */
    
    @PostMapping(path = "/accept-invitation-and-register")
    @Operation(summary = "Accept invitation and register for regulator user")
    @ApiResponse(responseCode = "204", description = SwaggerApiInfo.NO_CONTENT)
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.ACCEPT_REGULATOR_USER_INVITATION_BAD_REQUEST ,content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = RoleType.REGULATOR, authoritiesRequired = false)
    public ResponseEntity<Void> acceptRegulatorInvitationAndRegister(
    		@RequestBody @Valid @Parameter(description = "The invitation token", required = true) TokenDTO invitationTokenDTO,
            @Parameter(hidden = true) AppUser currentUser) {
    	regulatorUserAcceptInvitationService.acceptInvitationAndRegister(currentUser, invitationTokenDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
}
