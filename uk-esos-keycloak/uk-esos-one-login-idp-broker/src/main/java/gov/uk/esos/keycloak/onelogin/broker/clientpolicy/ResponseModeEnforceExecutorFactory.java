package gov.uk.esos.keycloak.onelogin.broker.clientpolicy;

import org.keycloak.Config;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.protocol.oidc.OIDCWellKnownProvider;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.provider.ProviderConfigurationBuilder;
import org.keycloak.services.clientpolicy.executor.ClientPolicyExecutorProvider;
import org.keycloak.services.clientpolicy.executor.ClientPolicyExecutorProviderFactory;

import java.util.List;

public class ResponseModeEnforceExecutorFactory implements ClientPolicyExecutorProviderFactory {
    public static final String PROVIDER_ID = "ol-idp-response-mode-enforce";
    public static final String CONFIG_RESPONSE_MODES_ENFORCED = "responseModesEnforced";

    @Override
    public String getHelpText() {
        return "Enforces use of specific response modes for clients.";
    }

    @Override
    public List<ProviderConfigProperty> getConfigProperties() {
        return ProviderConfigurationBuilder.create()
                .property().name(CONFIG_RESPONSE_MODES_ENFORCED)
                .type(ProviderConfigProperty.MULTIVALUED_LIST_TYPE)
                .label("Response modes to enforce")
                .helpText("Comma-separated list of response modes to enforce (e.g., query,fragment)")
                .options(OIDCWellKnownProvider.DEFAULT_RESPONSE_MODES_SUPPORTED)
                .add()
                .build();
    }

    @Override
    public ClientPolicyExecutorProvider create(KeycloakSession session) {
        return new ResponseModeEnforceExecutor();
    }

    @Override
    public void init(Config.Scope config) {

    }

    @Override
    public void postInit(KeycloakSessionFactory factory) {

    }

    @Override
    public void close() {

    }

    @Override
    public String getId() {
        return PROVIDER_ID;
    }
}
