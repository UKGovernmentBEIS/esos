package gov.uk.esos.keycloak.onelogin.broker;

import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.models.FederatedIdentityModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

public class Util {
    public static final String GOVUK_ONELOGIN_IDP_ALIAS = "govuk-one-login";
    public static final String AUTH_NOTE_INVALID_USER_EXISTING_USER = "AUTH_NOTE_INVALID_USER_EXISTING_USER";
    public static final String AUTH_NOTE_INVALID_USER_ATTEMPTING_USER = "AUTH_NOTE_INVALID_USER_ATTEMPTING_USER";
    public static final String EVENT_DETAIL_TEMP_USER_FOR_CREATION = "EVENT_DETAIL_TEMP_USER_FOR_CREATION";

    private Util() {
        // Utility class, no instantiation allowed
    }

    public static UserModel getUserByEmail(AuthenticationFlowContext context, String email) {
        KeycloakSession session = context.getSession();
        RealmModel realm = context.getRealm();
        return session.users().getUserByEmail(realm, email);
    }

    public static FederatedIdentityModel getFederatedIdentityForUser(AuthenticationFlowContext context, UserModel user) {
        KeycloakSession session = context.getSession();
        RealmModel realm = context.getRealm();
        return user != null ? session.users().getFederatedIdentity(realm, user, GOVUK_ONELOGIN_IDP_ALIAS) : null;
    }
}
