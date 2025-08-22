package gov.uk.esos.keycloak.onelogin.broker.authenticator;

import org.keycloak.authentication.Authenticator;
import org.keycloak.models.KeycloakSession;

public class OneLoginIdpEmailVerificationAuthenticatorFactory implements BaseOneLoginIdpAuthenticatorFactory {
    public static final String PROVIDER_ID = "ol-idp-email-verification";
    private static final OneLoginIdpEmailVerificationAuthenticator SINGLETON = new OneLoginIdpEmailVerificationAuthenticator();

    @Override
    public String getDisplayType() {
        return "GOVUK OneLogin IDP - Verify new user email";
    }

    @Override
    public String getHelpText() {
        return "Verifies the email address provided by a new user";
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
