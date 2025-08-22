package gov.uk.esos.keycloak.onelogin.broker.authenticator.conditional;

import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.authenticators.conditional.ConditionalAuthenticator;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.protocol.oidc.OIDCLoginProtocol;

public class OneLoginIdpExistingUserLoginHintConditionalAuthenticator implements ConditionalAuthenticator {
    @Override
    public boolean matchCondition(AuthenticationFlowContext context) {
        boolean hasLoginHint = context.getAuthenticationSession().getClientNote(OIDCLoginProtocol.LOGIN_HINT_PARAM) != null;
        return hasLoginHint == Boolean.parseBoolean(context.getAuthenticatorConfig().getConfig().get("needsLoginHint"));
    }

    @Override
    public void action(AuthenticationFlowContext context) {
        // NOT NEEDED
    }

    @Override
    public boolean requiresUser() {
        return false;
    }

    @Override
    public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) {
        // NOT NEEDED
    }

    @Override
    public void close() {
        // NOT NEEDED
    }
}
