package gov.uk.esos.keycloak.onelogin.broker.authenticator;

import jakarta.ws.rs.core.MultivaluedMap;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.RequiredActionFactory;
import org.keycloak.authentication.authenticators.browser.OTPFormAuthenticator;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import java.util.Collections;
import java.util.List;

public class OneLoginIdpOtpAuthenticator extends OTPFormAuthenticator {
    @Override
    public void action(AuthenticationFlowContext context) {
        MultivaluedMap<String, String> queryParams = context.getHttpRequest().getUri().getQueryParameters(true);
        if (queryParams.containsKey("formAction") && "cancel".equals(queryParams.getFirst("formAction"))) {
            context.cancelLogin();
            return;
        }

        super.action(context);
    }

    @Override
    public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) {
        // We need to override this method to avoid setting CONFIG_TOTP required action as in base class
    }

    @Override
    public List<RequiredActionFactory> getRequiredActions(KeycloakSession session) {
        return Collections.emptyList();
    }
}
