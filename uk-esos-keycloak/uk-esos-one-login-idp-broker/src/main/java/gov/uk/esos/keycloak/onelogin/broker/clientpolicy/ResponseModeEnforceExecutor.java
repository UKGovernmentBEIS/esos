package gov.uk.esos.keycloak.onelogin.broker.clientpolicy;

import org.keycloak.OAuthErrorException;
import org.keycloak.protocol.oidc.endpoints.request.AuthorizationEndpointRequest;
import org.keycloak.representations.idm.ClientPolicyExecutorConfigurationRepresentation;
import org.keycloak.services.clientpolicy.ClientPolicyContext;
import org.keycloak.services.clientpolicy.ClientPolicyEvent;
import org.keycloak.services.clientpolicy.ClientPolicyException;
import org.keycloak.services.clientpolicy.context.AuthorizationRequestContext;
import org.keycloak.services.clientpolicy.executor.ClientPolicyExecutorProvider;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public class ResponseModeEnforceExecutor implements ClientPolicyExecutorProvider<ClientPolicyExecutorConfigurationRepresentation> {
    private ClientPolicyExecutorConfigurationRepresentation configuration;

    @Override
    public String getProviderId() {
        return ResponseModeEnforceExecutorFactory.PROVIDER_ID;
    }

    @Override
    public void setupConfiguration(ClientPolicyExecutorConfigurationRepresentation config) {
        this.configuration = config;
    }

    @Override
    public void executeOnEvent(ClientPolicyContext context) throws ClientPolicyException {
        Map<String, Object> config = this.configuration.getConfigAsMap();
        List<String> enforcedResponseModes = (List<String>) config.get(ResponseModeEnforceExecutorFactory.CONFIG_RESPONSE_MODES_ENFORCED);

        if (context.getEvent().equals(ClientPolicyEvent.AUTHORIZATION_REQUEST)) {
            AuthorizationRequestContext authorizationRequestContext = (AuthorizationRequestContext) context;
            AuthorizationEndpointRequest request = authorizationRequestContext.getAuthorizationEndpointRequest();
            String responseType = request.getResponseType();
            String responseMode = Optional.ofNullable(request.getResponseMode()).orElseGet(() -> {
                if ("token".equals(responseType)) {
                    return "fragment";
                } else {
                    return "query";
                }
            });

            if (!enforcedResponseModes.contains(responseMode)) {
                throw new ClientPolicyException(OAuthErrorException.INVALID_REQUEST, "Response mode '" + responseMode + "' is not allowed. Allowed response modes: " + String.join(", ", enforcedResponseModes));
            }
        }
    }
}
