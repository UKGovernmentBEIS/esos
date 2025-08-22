package gov.uk.esos.keycloak.onelogin.broker.event;

import gov.uk.esos.keycloak.onelogin.broker.Util;
import lombok.extern.jbosslog.JBossLog;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import java.util.List;

@JBossLog
public class OneLoginIdpEventListener implements EventListenerProvider {
    private static final List<EventType> SUPPORTED_EVENTS = List.of(
            EventType.IDENTITY_PROVIDER_FIRST_LOGIN_ERROR,
            EventType.FEDERATED_IDENTITY_LINK_ERROR
    );

    private final KeycloakSession session;

    public OneLoginIdpEventListener(KeycloakSession session) {
        this.session = session;
    }

    @Override
    public void onEvent(Event event) {
        if (SUPPORTED_EVENTS.contains(event.getType()) && event.getDetails().containsKey(Util.EVENT_DETAIL_TEMP_USER_FOR_CREATION)) {
            RealmModel realm = session.getContext().getRealm();
            String email = event.getDetails().get(Util.EVENT_DETAIL_TEMP_USER_FOR_CREATION);
            UserModel tempUser = session.users().getUserByEmail(realm, email);
            session.users().removeUser(realm, tempUser);
            log.warnf("Removing temporarily created user for OneLogin IDP: %s", email);
        }
    }

    @Override
    public void onEvent(AdminEvent event, boolean includeRepresentation) {
        // NOT NEEDED
    }

    @Override
    public void close() {
        // NOT NEEDED
    }
}
