package gov.uk.esos.keycloak.user.api.provider;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.transaction.Transactional;
import lombok.extern.jbosslog.JBossLog;
import org.keycloak.connections.jpa.JpaConnectionProvider;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.RealmProvider;
import org.keycloak.models.UserModel;
import org.keycloak.models.jpa.entities.UserAttributeEntity;
import org.keycloak.models.jpa.entities.UserEntity;

@JBossLog
public class LastLoginEventListenerProvider implements EventListenerProvider {

    private static final String ATTR_LAST_LOGIN = "lastLoginDate";

    private final KeycloakSession session;
    private final RealmProvider model;
    private final EntityManager entityManager;

    public LastLoginEventListenerProvider(KeycloakSession session) {
        this.session = session;
        this.model = session.realms();
        entityManager = session.getProvider(JpaConnectionProvider.class).getEntityManager();
    }

    @Override
    @Transactional
    public void onEvent(Event event) {

        if (!EventType.LOGIN.equals(event.getType())) {
            return;
        }
        log.infof("onEvent event=%s type=%s realm=%suserId=%s", event, event.getType(), event.getRealmId(), event.getUserId());

        final RealmModel realm = this.model.getRealm(event.getRealmId());
        final UserModel userModel = this.session.users().getUserById(realm, event.getUserId());

        if (userModel == null) {
            return;
        }
        log.infof("Updating last login status for user: " + event.getUserId());

        // Use current server time for login event
        OffsetDateTime loginTime = OffsetDateTime.now(ZoneOffset.UTC);
        String loginTimeS = DateTimeFormatter.ISO_DATE_TIME.format(loginTime);
        UserEntity userEntity = entityManager.find(UserEntity.class, event.getUserId(), LockModeType.PESSIMISTIC_WRITE);
        UserAttributeEntity attribute = createLastLoginAttribute(userEntity, loginTimeS);
        entityManager.merge(attribute);
    }

    @Override
    public void onEvent(AdminEvent event, boolean includeRepresentation) {
        // do nothing
    }

    @Override
    public void close() {
        // Nothing to close
    }

    private UserAttributeEntity createLastLoginAttribute(UserEntity userEntity, String lastLogin) {
        UserAttributeEntity userAttribute = userEntity.getAttributes().stream()
            .filter(a -> a.getName().equals(ATTR_LAST_LOGIN))
            .findFirst()
            .orElse(new UserAttributeEntity());
        if (userAttribute.getId() == null) {
            userAttribute.setId(UUID.randomUUID().toString());
        }
        if (userAttribute.getUser() == null) {
            userAttribute.setUser(userEntity);
        }
        userAttribute.setName(ATTR_LAST_LOGIN);
        userAttribute.setValue(lastLogin);
        return userAttribute;
    }
}