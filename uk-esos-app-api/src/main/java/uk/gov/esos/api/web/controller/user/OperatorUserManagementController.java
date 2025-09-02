package uk.gov.esos.api.web.controller.user;

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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.user.core.domain.dto.EmailDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.service.OperatorUserManagementService;
import uk.gov.esos.api.web.constants.SwaggerApiInfo;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.security.Authorized;
import uk.gov.esos.api.web.security.AuthorizedRole;

import static uk.gov.esos.api.common.domain.enumeration.RoleType.OPERATOR;

@RestController
@RequestMapping(path = "/v1.0/operator-users")
@Tag(name = "Operator Users")
@RequiredArgsConstructor
public class OperatorUserManagementController {

    private final OperatorUserManagementService operatorUserManagementService;

    /**
     * Retrieves info of user by account and user id.
     *
     * @param accountId Account id
     * @param userId Keycloak user id
     * @return {@link OperatorUserDTO}
     */
    @GetMapping(path = "/account/{accountId}/{userId}")
    @Operation(summary = "Retrieves info of operator user by account and user id")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = OperatorUserDTO.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<OperatorUserDTO> getOperatorUserById(
            @PathVariable("accountId") @Parameter(description = "The account id") Long accountId,
            @PathVariable("userId") @Parameter(description = "The operator user id") String userId) {
        return new ResponseEntity<>(operatorUserManagementService.getOperatorUserByAccountAndId(accountId, userId),
                HttpStatus.OK);
    }

    /**
     * Updates logged in operator user.
     *
     * @param pmrvUser {@link AppUser}
     * @param operatorUserDTO {@link OperatorUserDTO}
     * @return {@link OperatorUserDTO}
     */
    @PatchMapping(path = "/operator")
    @Operation(summary = "Updates logged in operator user")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = OperatorUserDTO.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = OPERATOR)
    public ResponseEntity<OperatorUserDTO> updateCurrentOperatorUser(
            @Parameter(hidden = true) AppUser pmrvUser,
            @RequestBody @Valid @Parameter(description = "The modified operator user", required = true) OperatorUserDTO operatorUserDTO) {
        operatorUserManagementService.updateOperatorUser(pmrvUser, operatorUserDTO);
        return new ResponseEntity<>(operatorUserDTO, HttpStatus.OK);
    }

    /**
     * Updates operator user by account and user id.
     *
     * @param accountId Account id
     * @param userId Keycloak user id
     * @param operatorUserDTO {@link OperatorUserDTO}
     * @return {@link OperatorUserDTO}
     */
    @PatchMapping(path = "/account/{accountId}/{userId}")
    @Operation(summary = "Updates operator user by account and user id")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = OperatorUserDTO.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<OperatorUserDTO> updateOperatorUserById(
            @PathVariable("accountId") @Parameter(description = "The account id") Long accountId,
            @PathVariable("userId") @Parameter(description = "The operator user id") String userId,
            @RequestBody @Valid @Parameter(description = "The modified operator user", required = true) OperatorUserDTO operatorUserDTO) {
        operatorUserManagementService.updateOperatorUserByAccountAndId(accountId, userId, operatorUserDTO);
        return new ResponseEntity<>(operatorUserDTO, HttpStatus.OK);
    }
    
    /**
     * Resets the 2FA device for an operator user by account and user id.
     *
     * @param accountId Account id
     * @param userId Keycloak user id
     * @deprecated Reset 2fa is only allowed through {@link UserSecuritySetupController#requestToReset2fa(EmailDTO)}
     */
    @Deprecated(forRemoval = true)
    @PatchMapping(path = "/account/{accountId}/{userId}/reset-2fa")
    @Operation(summary = "Resets the 2FA device for an operator user by account and user id")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = OperatorUserDTO.class))})
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.AUTHORITY_USER_NOT_RELATED_TO_ACCOUNT, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<Void> resetOperator2Fa(
            @PathVariable("accountId") @Parameter(description = "The account id") Long accountId,
            @PathVariable("userId") @Parameter(description = "The operator user id") String userId) {
        operatorUserManagementService.resetOperator2Fa(accountId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    
}
