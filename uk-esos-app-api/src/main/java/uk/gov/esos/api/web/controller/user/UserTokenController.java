package uk.gov.esos.api.web.controller.user;

import static uk.gov.esos.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.OK;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.user.core.domain.dto.EmailDTO;
import uk.gov.esos.api.user.core.domain.dto.InvitationTokenDTO;
import uk.gov.esos.api.user.core.service.UserInvitationTokenService;
import uk.gov.esos.api.web.constants.SwaggerApiInfo;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;

@RestController
@RequestMapping(path = "/v1.0/users/token")
@Tag(name = "User token")
@SecurityRequirements
@RequiredArgsConstructor
public class UserTokenController {

    private final UserInvitationTokenService userInvitationTokenService;

    @PostMapping(path = "/resolve-email")
    @Operation(summary = "Verifies the JWT token and returns the email")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = EmailDTO.class))})
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.USERS_TOKEN_VERIFICATION_BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
	public ResponseEntity<EmailDTO> resolveEmailByToken(
			@RequestBody @Valid @Parameter(description = "The verification token", required = true) InvitationTokenDTO invitationTokenDTO) {
        final String email = userInvitationTokenService.resolveEmail(invitationTokenDTO);
        return new ResponseEntity<>(new EmailDTO(email), HttpStatus.OK);
    }

}
