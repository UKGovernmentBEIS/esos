package gov.uk.esos.keycloak.onelogin.broker.authenticator;

import org.keycloak.authentication.Authenticator;
import org.keycloak.models.KeycloakSession;

public class OneLoginIdpNewUserInfoAuthenticatorFactory implements BaseOneLoginIdpAuthenticatorFactory {
    public static final String PROVIDER_ID = "ol-new-user-info";
    private static final OneLoginIdpNewUserInfoAuthenticator SINGLETON = new OneLoginIdpNewUserInfoAuthenticator();

    @Override
    public String getDisplayType() {
        return "GOVUK OneLogin IDP - Get new user info";
    }

    @Override
    public String getHelpText() {
        return "Form authenticator that gets user email, first name and last name.";
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
