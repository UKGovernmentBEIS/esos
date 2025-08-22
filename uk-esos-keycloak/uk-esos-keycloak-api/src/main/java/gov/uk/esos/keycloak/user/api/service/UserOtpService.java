package gov.uk.esos.keycloak.user.api.service;

import gov.uk.esos.keycloak.user.api.model.UserOtpValidationDTO;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.core.UriInfo;
import org.apache.commons.lang3.StringUtils;
import org.keycloak.credential.CredentialProvider;
import org.keycloak.credential.OTPCredentialProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserCredentialModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.credential.OTPCredentialModel;
import org.keycloak.services.managers.BruteForceProtector;

public class UserOtpService {

    private final KeycloakSession session;

    private final UserSessionService userSessionService;

    public UserOtpService(KeycloakSession session, UserSessionService userSessionService) {
        this.session = session;
        this.userSessionService = userSessionService;
    }

    public void validateUserOtp(UserOtpValidationDTO userOtpValidationDTO) {

        if (StringUtils.isEmpty(userOtpValidationDTO.getOtp())) {
            throw new BadRequestException("Otp is not provided in request");
        }

        UserModel user = !StringUtils.isEmpty(userOtpValidationDTO.getEmail())
            ? userSessionService.getUserByEmail(userOtpValidationDTO.getEmail())
            : userSessionService.getAuthenticatedUser();

        validateUserOtp(userOtpValidationDTO.getOtp(), user);
    }

    private void validateUserOtp(String otp, UserModel user) {
        OTPCredentialProvider credentialProvider =
            (OTPCredentialProvider) session.getProvider(CredentialProvider.class, "keycloak-otp");
        RealmModel realm = session.getContext().getRealm();
        UriInfo uriInfo = session.getContext().getUri();
        OTPCredentialModel preferredCredential = credentialProvider.getDefaultCredential(session, realm, user);
        BruteForceProtector protector = session.getProvider(BruteForceProtector.class);

        //if 2FA is not setup for user
        if (preferredCredential == null) {
            throw new BadRequestException("User has not setup 2FA");
        }

        //if user is temporarily disabled
        if (realm.isBruteForceProtected() && protector.isTemporarilyDisabled(session, realm, user)) {
            throw new BadRequestException("User is temporarily disabled");
        }

        //Check the OTP validity
        boolean otpValid = credentialProvider.isValid(realm, user,
            new UserCredentialModel(preferredCredential.getId(), credentialProvider.getType(), otp));

        if (!otpValid) {
            //Users should be disabled when multiple incorrect 2FA codes are attempted in succession.
            if (realm.isBruteForceProtected() && user != null) {
                protector.failedLogin(realm, user, session.getContext().getConnection(), uriInfo);
            }
            throw new BadRequestException("Invalid OTP");
        } else {
            //If a valid 2FA code has subsequently been entered within the allowed incorrect count range,
            //the incorrect 2FA count should be reset to zero
            if (realm.isBruteForceProtected() && user != null) {
                protector.successfulLogin(realm, user, session.getContext().getConnection(), uriInfo);
            }
        }
    }

}
