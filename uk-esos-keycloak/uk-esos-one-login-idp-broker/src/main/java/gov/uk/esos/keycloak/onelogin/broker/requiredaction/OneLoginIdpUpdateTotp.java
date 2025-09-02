package gov.uk.esos.keycloak.onelogin.broker.requiredaction;

import jakarta.ws.rs.core.Response;
import org.keycloak.authentication.AuthenticatorUtil;
import org.keycloak.authentication.RequiredActionContext;
import org.keycloak.authentication.requiredactions.UpdateTotp;
import org.keycloak.models.SubjectCredentialManager;
import org.keycloak.models.credential.OTPCredentialModel;

public class OneLoginIdpUpdateTotp extends UpdateTotp {
    public static final String ID = "OL_IDP_UPDATE_TOTP";
    private static final String ERROR_NO_PASSWORD_CONFIRMATION = "Your password has not been verified";

    @Override
    public void requiredActionChallenge(RequiredActionContext context) {
        if (!AuthenticatorUtil.isPasswordValidated(context.getAuthenticationSession())) {
            Response response = context.form()
                    .setError(ERROR_NO_PASSWORD_CONFIRMATION)
                    .createErrorPage(Response.Status.UNAUTHORIZED);
            context.challenge(response);
        } else {
            super.requiredActionChallenge(context);
        }
    }

    @Override
    public void processAction(RequiredActionContext context) {
        deleteUserOtpCredentials(context);
        super.processAction(context);
    }

    @Override
    public String getId() {
        return ID;
    }

    @Override
    public String getDisplayText() {
        return "Configure OTP after password confirmation";
    }

    private void deleteUserOtpCredentials(RequiredActionContext context) {
        final SubjectCredentialManager credentialManager = context.getUser().credentialManager();
        credentialManager.getStoredCredentialsByTypeStream(OTPCredentialModel.TYPE)
                .forEach(storedCredential -> {
                    credentialManager.removeStoredCredentialById(storedCredential.getId());
                });
    }
}
