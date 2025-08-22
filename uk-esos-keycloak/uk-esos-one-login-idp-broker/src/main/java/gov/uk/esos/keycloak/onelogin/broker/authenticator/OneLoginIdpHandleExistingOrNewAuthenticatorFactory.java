package gov.uk.esos.keycloak.onelogin.broker.authenticator;

import org.keycloak.authentication.Authenticator;
import org.keycloak.models.KeycloakSession;

public class OneLoginIdpHandleExistingOrNewAuthenticatorFactory implements BaseOneLoginIdpAuthenticatorFactory {
    public static final String PROVIDER_ID = "ol-handle-existing-or-add-new";
    private static final OneLoginIdpHandleExistingOrNewAuthenticator SINGLETON = new OneLoginIdpHandleExistingOrNewAuthenticator();

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public Authenticator create(KeycloakSession session) {
        return SINGLETON;
    }

    @Override
    public String getDisplayType() {
        return "GOVUK OneLogin IDP - Check existing user or add new";
    }

    @Override
    public String getHelpText() {
        return "Upon first login with GOVUK One Login, this authenticator starts the account linking process " +
                "by asking the user whether they have an existing service account or they want to create" +
                "a new one";
    }
}
