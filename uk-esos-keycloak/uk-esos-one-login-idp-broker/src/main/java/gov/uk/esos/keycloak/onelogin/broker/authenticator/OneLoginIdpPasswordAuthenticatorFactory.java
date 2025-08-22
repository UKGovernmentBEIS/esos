package gov.uk.esos.keycloak.onelogin.broker.authenticator;

import org.keycloak.authentication.Authenticator;
import org.keycloak.models.KeycloakSession;

public class OneLoginIdpPasswordAuthenticatorFactory implements BaseOneLoginIdpAuthenticatorFactory {
    public static final String PROVIDER_ID = "ol-idp-password-form";
    private static final OneLoginIdpPasswordAuthenticator SINGLETON = new OneLoginIdpPasswordAuthenticator();

    @Override
    public String getDisplayType() {
        return "GOVUK OneLogin IDP - Base password form with 1 to 1 check for linking";
    }

    @Override
    public String getHelpText() {
        return "Presents a password form to the user and checks whether it complies with 1 to 1 account linking requirement";
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
