package gov.uk.esos.keycloak.onelogin.broker.authenticator.conditional;

import org.keycloak.Config;
import org.keycloak.authentication.authenticators.conditional.ConditionalAuthenticator;
import org.keycloak.authentication.authenticators.conditional.ConditionalAuthenticatorFactory;
import org.keycloak.models.AuthenticationExecutionModel;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;

import java.util.List;

public class OneLoginIdpExistingUserConditionalAuthenticatorFactory implements ConditionalAuthenticatorFactory {
    public static final String PROVIDER_ID = "ol-idp-existing-user-conditional";
    public static final OneLoginIdpExistingUserConditionalAuthenticator SINGLETON = new OneLoginIdpExistingUserConditionalAuthenticator();

    @Override
    public ConditionalAuthenticator getSingleton() {
        return SINGLETON;
    }

    @Override
    public String getDisplayType() {
        return "GOVUK OneLogin IDP - Conditional - User claims exists";
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
        return "Condition to show username/password and otp forms when a user already has a service account";
    }

    @Override
    public List<ProviderConfigProperty> getConfigProperties() {
        return List.of(new ProviderConfigProperty("userExists",
                "User exists",
                "Flag indicating if user is existing/returning or new",
                ProviderConfigProperty.BOOLEAN_TYPE,
                Boolean.FALSE));
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
