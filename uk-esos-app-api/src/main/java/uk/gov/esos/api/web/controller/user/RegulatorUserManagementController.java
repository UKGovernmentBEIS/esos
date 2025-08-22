package uk.gov.esos.api.web.controller.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.token.FileToken;
import uk.gov.esos.api.user.core.service.UserSignatureService;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserDTO;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserUpdateDTO;
import uk.gov.esos.api.user.regulator.service.RegulatorUserManagementService;
import uk.gov.esos.api.web.constants.SwaggerApiInfo;
import uk.gov.esos.api.web.controller.exception.ErrorResponse;
import uk.gov.esos.api.web.orchestrator.authorization.service.RegulatorUserAuthorityUpdateOrchestrator;
import uk.gov.esos.api.web.security.Authorized;
import uk.gov.esos.api.web.security.AuthorizedRole;
import uk.gov.esos.api.web.util.FileDtoMapper;

import java.io.IOException;
import java.util.UUID;

import static uk.gov.esos.api.web.constants.SwaggerApiInfo.AUTHORITY_USER_NOT_RELATED_TO_CA;
import static uk.gov.esos.api.web.constants.SwaggerApiInfo.UPDATE_REGULATOR_USER_BAD_REQUEST;

@RestController
@RequestMapping(path = "/v1.0/regulator-users")
@Tag(name = "Regulator Users")
@RequiredArgsConstructor
public class RegulatorUserManagementController {

    private final RegulatorUserAuthorityUpdateOrchestrator regulatorUserAuthorityUpdateOrchestrator;
    private final RegulatorUserManagementService regulatorUserManagementService;
    private final UserSignatureService userSignatureService;
    private final FileDtoMapper fileDtoMapper = Mappers.getMapper(FileDtoMapper.class);

    @GetMapping(path = "/{userId}")
    @Operation(summary = "Retrieves the user of type REGULATOR that corresponds to the provided user id")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = RegulatorUserDTO.class))})
    @ApiResponse(responseCode = "400", description = AUTHORITY_USER_NOT_RELATED_TO_CA, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized
    public ResponseEntity<RegulatorUserDTO> getRegulatorUserByCaAndId(
            @Parameter(hidden = true) AppUser pmrvUser,
            @PathVariable("userId") @Parameter(description = "The regulator user id") String userId) {
        return new ResponseEntity<>(regulatorUserManagementService.getRegulatorUserByUserId(pmrvUser, userId),
                HttpStatus.OK);
    }

    @PostMapping(path = "/{userId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @Operation(summary = "Updates the user of type REGULATOR that corresponds to the provided user id")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = RegulatorUserUpdateDTO.class))})
    @ApiResponse(responseCode = "400", description = UPDATE_REGULATOR_USER_BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized
    public ResponseEntity<RegulatorUserUpdateDTO> updateRegulatorUserByCaAndId(
            @Parameter(hidden = true) AppUser currentUser,
            @PathVariable("userId") @Parameter(description = "The regulator user id to update") String userId,
            @RequestPart @Valid @Parameter(description = "The regulator user to update", required = true) RegulatorUserUpdateDTO regulatorUserUpdateDTO,
            @RequestPart(name = "signature", required = false) @Parameter(description = "The signature file", required = false) MultipartFile signature
    ) throws IOException {
        FileDTO signatureDTO = fileDtoMapper.toFileDTO(signature);
        regulatorUserAuthorityUpdateOrchestrator.updateRegulatorUserByUserId(currentUser, userId, regulatorUserUpdateDTO, signatureDTO);
        return new ResponseEntity<>(regulatorUserUpdateDTO, HttpStatus.OK);
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @Operation(summary = "Updates the current regulator user")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = RegulatorUserUpdateDTO.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = RoleType.REGULATOR)
    public ResponseEntity<RegulatorUserUpdateDTO> updateCurrentRegulatorUser(
            @Parameter(hidden = true) AppUser currentUser,
            @RequestPart @Valid @Parameter(description = "The regulator user to update", required = true) RegulatorUserUpdateDTO regulatorUserUpdateDTO,
            @RequestPart(name = "signature", required = false) @Parameter(description = "The signature file", required = false) MultipartFile signature
    ) throws IOException {
        FileDTO signatureDTO = fileDtoMapper.toFileDTO(signature);
        regulatorUserAuthorityUpdateOrchestrator
                .updateRegulatorUserByUserId(currentUser, currentUser.getUserId(), regulatorUserUpdateDTO, signatureDTO);
        return new ResponseEntity<>(regulatorUserUpdateDTO, HttpStatus.OK);
    }

    @GetMapping(path = "/{userId}/signature")
    @Operation(summary = "Generate the token to get the signature of the user with the provided user id")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FileToken.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized
    public ResponseEntity<FileToken> generateGetRegulatorSignatureToken(
            @PathVariable("userId") @Parameter(description = "The regulator user id the signature belongs to") @NotNull String userId,
            @RequestParam("signatureUuid") @Parameter(name = "signatureUuid", description = "The signature uuid") @NotNull UUID signatureUuid) {
        FileToken getFileToken =
                userSignatureService.generateSignatureFileToken(userId, signatureUuid);
        return new ResponseEntity<>(getFileToken, HttpStatus.OK);
    }
    
    @PostMapping(path = "/{userId}/reset-2fa")
    @Operation(summary = "Resets the 2FA device for the user of type REGULATOR that corresponds to the provided user id")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = RegulatorUserUpdateDTO.class))})
    @ApiResponse(responseCode = "400", description = AUTHORITY_USER_NOT_RELATED_TO_CA, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized
    public ResponseEntity<Void> resetRegulator2Fa(
            @Parameter(hidden = true) AppUser currentUser,
            @PathVariable("userId") @Parameter(description = "Regulator's user id to reset 2FA") String userId) {
    	regulatorUserManagementService.resetRegulator2Fa(currentUser, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
}
