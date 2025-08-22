package gov.uk.esos.keycloak.onelogin.broker.authenticator.conditional;

import org.keycloak.Config;
import org.keycloak.authentication.authenticators.conditional.ConditionalAuthenticator;
import org.keycloak.authentication.authenticators.conditional.ConditionalAuthenticatorFactory;
import org.keycloak.models.AuthenticationExecutionModel;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;

import java.util.List;

public class OneLoginIdpExistingUserLoginHintConditionalAuthenticatorFactory implements ConditionalAuthenticatorFactory {
    public static final String PROVIDER_ID = "ol-idp-conditional-login-hint";
    private static final OneLoginIdpExistingUserLoginHintConditionalAuthenticator SINGLETON = new OneLoginIdpExistingUserLoginHintConditionalAuthenticator();

    @Override
    public ConditionalAuthenticator getSingleton() {
        return SINGLETON;
    }

    @Override
    public String getDisplayType() {
        return "GOVUK OneLogin IDP - Conditional - Check login_hint for existing user";
    }

    @Override
    public boolean isConfigurable() {
        return true;
    }

    @Override
    public AuthenticationExecutionModel.Requirement[] getRequirementChoices() {
        return new AuthenticationExecutionModel.Requirement[]{
                AuthenticationExecutionModel.Requirement.REQUIRED,
                AuthenticationExecutionModel.Requirement.DISABLED
        };
    }

    @Override
    public boolean isUserSetupAllowed() {
        return false;
    }

    @Override
    public String getHelpText() {
        return "If user exists this authenticator will check if there is a login_hint and will continue the flow according to configuration.";
    }

    @Override
    public List<ProviderConfigProperty> getConfigProperties() {
        return List.of(new ProviderConfigProperty("needsLoginHint",
                "Needs login_hint",
                "Flag indicating whether the flow continuation requires a login_hint parameter to be present in the authentication session.",
                ProviderConfigProperty.BOOLEAN_TYPE,
                Boolean.TRUE));
    }

    @Override
    public void init(Config.Scope config) {
        // NOT NEEDED
    }

    @Override
    public void postInit(KeycloakSessionFactory factory) {
        // NOT NEEDED
    }

    @Override
    public void close() {
        // NOT NEEDED
    }

    @Override
    public String getId() {
        return PROVIDER_ID;
    }
}
