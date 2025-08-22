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
import uk.gov.esos.api.user.operator.domain.OperatorInvitedUserInfoDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserInviteAndRegisterDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserRegistrationDTO;
import uk.gov.esos.api.user.operator.service.OperatorUserAcceptInvitationService;
import uk.gov.esos.api.user.operator.service.OperatorUserRegistrationService;
import uk.gov.esos.api.web.constants.SwaggerApiInfo;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.security.AuthorizedRole;

import static uk.gov.esos.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.NOT_FOUND;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.OK;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.VALIDATION_ERROR_BAD_REQUEST;

@RestController
@RequestMapping(path = "/v1.0/operator-users/registration")
@Tag(name = "Operator users registration")
@SecurityRequirements
@RequiredArgsConstructor
public class OperatorUserRegistrationController {

    private final OperatorUserRegistrationService operatorUserRegistrationService;
    private final OperatorUserAcceptInvitationService operatorUserAcceptInvitationService;

    @PostMapping(path = "/register")
    @Operation(summary = "Register a new operator user")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = OperatorUserDTO.class))})
    @ApiResponse(responseCode = "400", description = VALIDATION_ERROR_BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = RoleType.OPERATOR, authoritiesRequired = false)
	public ResponseEntity<OperatorUserDTO> registerCurrentOperatorUser(
			@RequestBody @Valid @Parameter(description = "The userRegistrationDTO", required = true) OperatorUserRegistrationDTO userRegistrationDTO,
			@Parameter(hidden = true) AppUser currentUser) {
        return new ResponseEntity<>(operatorUserRegistrationService.registerUser(userRegistrationDTO, currentUser), HttpStatus.OK);
    }
    
    @PostMapping(path = "/accept-invitation-and-register")
    @Operation(summary = "Accept invitation and register for operator user")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = OperatorInvitedUserInfoDTO.class))})
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.ACCEPT_OPERATOR_INVITATION_TOKEN_BAD_REQUEST ,content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = RoleType.OPERATOR, authoritiesRequired = false)
    public ResponseEntity<OperatorInvitedUserInfoDTO> acceptOperatorInvitationAndRegister(
    		@RequestBody @Valid @Parameter(description = "The userRegistrationDTO", required = true) OperatorUserInviteAndRegisterDTO operatorUserInviteAndRegisterDTO,
            @Parameter(hidden = true) AppUser currentUser) {
    	final OperatorInvitedUserInfoDTO operatorInvitedUserInfoDTO = operatorUserAcceptInvitationService.acceptInvitationAndRegister(currentUser, operatorUserInviteAndRegisterDTO);
        return new ResponseEntity<>(operatorInvitedUserInfoDTO, HttpStatus.OK);
    }
    
    @PostMapping(path = "/accept-invitation")
    @Operation(summary = "Accept invitation for operator user")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = OperatorInvitedUserInfoDTO.class))})
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.ACCEPT_OPERATOR_INVITATION_TOKEN_BAD_REQUEST ,content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = RoleType.OPERATOR, authoritiesRequired = false)
    public ResponseEntity<OperatorInvitedUserInfoDTO> acceptOperatorInvitation(
    		@RequestBody @Valid @Parameter(description = "The invitation token", required = true) TokenDTO invitationTokenDTO,
            @Parameter(hidden = true) AppUser currentUser) {
    	final OperatorInvitedUserInfoDTO operatorInvitedUserInfoDTO = operatorUserAcceptInvitationService.acceptInvitation(currentUser, invitationTokenDTO);
        return new ResponseEntity<>(operatorInvitedUserInfoDTO, HttpStatus.OK);
    }
    
}
