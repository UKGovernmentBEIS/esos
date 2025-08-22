package gov.uk.esos.keycloak.onelogin.broker.authenticator;

import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.authenticators.broker.AbstractIdpAuthenticator;
import org.keycloak.authentication.authenticators.broker.util.SerializedBrokeredIdentityContext;
import org.keycloak.broker.provider.BrokeredIdentityContext;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.protocol.oidc.OIDCLoginProtocol;

public class OneLoginIdpHandleExistingOrNewAuthenticator extends AbstractIdpAuthenticator {
    public static final String USER_CLAIMS_EXISTS = "USER_CLAIMS_EXISTS";

    @Override
    protected void authenticateImpl(AuthenticationFlowContext context, SerializedBrokeredIdentityContext serializedCtx, BrokeredIdentityContext brokerContext) {
        String email = context.getAuthenticationSession().getClientNote(OIDCLoginProtocol.LOGIN_HINT_PARAM);

        if (email != null) {
            UserModel user = context.getSession().users().getUserByEmail(context.getRealm(), email);

            if (!user.isEnabled()) {
                user.setEnabled(true);
                context.getAuthenticationSession().setAuthNote(USER_CLAIMS_EXISTS, "false");
            } else {
                context.getAuthenticationSession().setAuthNote(USER_CLAIMS_EXISTS, "true");
            }

            context.setUser(user);
            context.success();
        } else {
            Response challengeResponse = context.form().createForm("idp-handle-existing-or-new.ftl");
            context.challenge(challengeResponse);
        }
    }

    @Override
    protected void actionImpl(AuthenticationFlowContext context, SerializedBrokeredIdentityContext serializedCtx, BrokeredIdentityContext brokerContext) {
        MultivaluedMap<String, String> formData = context.getHttpRequest().getDecodedFormParameters();
        context.getAuthenticationSession().setAuthNote(USER_CLAIMS_EXISTS, String.valueOf(formData.getFirst("existing")));
        context.success();
    }

    @Override
    public boolean requiresUser() {
        return false;
    }

    @Override
    public boolean configuredFor(KeycloakSession keycloakSession, RealmModel realmModel, UserModel userModel) {
        return false;
    }
}
