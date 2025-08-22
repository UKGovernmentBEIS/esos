package gov.uk.esos.keycloak.onelogin.broker.authenticator;

import org.keycloak.Config;
import org.keycloak.authentication.AuthenticatorFactory;
import org.keycloak.models.AuthenticationExecutionModel;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;

import java.util.List;

public interface BaseOneLoginIdpAuthenticatorFactory extends AuthenticatorFactory {
    default String getReferenceCategory() {
        return "firstBrokerLogin";
    }

    default boolean isConfigurable() {
        return false;
    }

    default boolean isUserSetupAllowed() {
        return false;
    }

    default List<ProviderConfigProperty> getConfigProperties() {
        return List.of();
    }

    default void init(Config.Scope config) { // NOT NEEDED
    }

    default void postInit(KeycloakSessionFactory factory) { // NOT NEEDED
    }

    default void close() { // NOT NEEDED
    }

    default AuthenticationExecutionModel.Requirement[] getRequirementChoices() {
        return new AuthenticationExecutionModel.Requirement[]{
                AuthenticationExecutionModel.Requirement.REQUIRED,
                AuthenticationExecutionModel.Requirement.DISABLED
        };
    }
}
