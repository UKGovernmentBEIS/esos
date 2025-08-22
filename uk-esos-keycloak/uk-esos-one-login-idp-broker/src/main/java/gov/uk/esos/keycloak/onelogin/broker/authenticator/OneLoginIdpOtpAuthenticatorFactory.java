package gov.uk.esos.keycloak.onelogin.broker.authenticator;

import org.keycloak.authentication.Authenticator;
import org.keycloak.models.KeycloakSession;

public class OneLoginIdpOtpAuthenticatorFactory implements BaseOneLoginIdpAuthenticatorFactory{
    public static final String PROVIDER_ID = "ol-idp-otp-form";
    private static final OneLoginIdpOtpAuthenticator SINGLETON = new OneLoginIdpOtpAuthenticator();

    @Override
    public String getDisplayType() {
        return "GOVUK OneLogin IDP - Base OTP form for IDP account linking";
    }

    @Override
    public String getHelpText() {
        return "Presents an OTP form without setting CONFIG_TOTP required action in case of non-existing credential";
    }

    @Override
    public Authenticator create(KeycloakSession session) {
        return SINGLETON;
    }

    @Override
    public String getId() {
        return PROVIDER_ID;
    }
}
