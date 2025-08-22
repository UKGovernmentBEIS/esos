package gov.uk.esos.keycloak.onelogin.broker.event;

import org.keycloak.Config;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventListenerProviderFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;

public class OneLoginIdpEventListenerFactory implements EventListenerProviderFactory {
    public static final String PROVIDER_ID = "ol-idp-event-listener";

    @Override
    public EventListenerProvider create(KeycloakSession session) {
        return new OneLoginIdpEventListener(session);
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
