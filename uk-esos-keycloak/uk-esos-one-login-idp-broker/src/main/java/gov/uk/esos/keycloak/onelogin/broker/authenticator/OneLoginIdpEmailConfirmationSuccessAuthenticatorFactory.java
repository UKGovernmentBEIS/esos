package gov.uk.esos.keycloak.onelogin.broker.authenticator;

import org.keycloak.authentication.Authenticator;
import org.keycloak.models.KeycloakSession;

public class OneLoginIdpEmailConfirmationSuccessAuthenticatorFactory implements BaseOneLoginIdpAuthenticatorFactory {
    public static final String PROVIDER_ID = "ol-idp-email-success";
    private static final OneLoginIdpEmailConfirmationSuccessAuthenticator SINGLETON = new OneLoginIdpEmailConfirmationSuccessAuthenticator();

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public String getDisplayType() {
        return "GOVUK OneLogin IDP - Email Confirmation Success";
    }

    @Override
    public String getHelpText() {
        return "This is the final confirmation page shown to a new user after they have successfully verified their email address.";
    }

    @Override
    public Authenticator create(KeycloakSession session) {
        return SINGLETON;
    }
}
