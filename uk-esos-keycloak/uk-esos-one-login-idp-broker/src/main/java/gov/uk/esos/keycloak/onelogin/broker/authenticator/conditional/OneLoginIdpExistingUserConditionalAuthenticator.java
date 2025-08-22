package gov.uk.esos.keycloak.onelogin.broker.authenticator.conditional;

import gov.uk.esos.keycloak.onelogin.broker.authenticator.OneLoginIdpHandleExistingOrNewAuthenticator;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.authenticators.conditional.ConditionalAuthenticator;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

public class OneLoginIdpExistingUserConditionalAuthenticator implements ConditionalAuthenticator {
    @Override
    public boolean matchCondition(AuthenticationFlowContext context) {
        return Boolean.parseBoolean(context.getAuthenticatorConfig().getConfig().get("userExists")) ==
                Boolean.parseBoolean(context.getAuthenticationSession().getAuthNote(OneLoginIdpHandleExistingOrNewAuthenticator.USER_CLAIMS_EXISTS));
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
