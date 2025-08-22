package gov.uk.esos.keycloak.onelogin.broker.authenticator;

import gov.uk.esos.keycloak.onelogin.broker.Util;
import jakarta.ws.rs.core.MultivaluedHashMap;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticationFlowError;
import org.keycloak.authentication.authenticators.browser.PasswordForm;
import org.keycloak.models.FederatedIdentityModel;
import org.keycloak.models.UserModel;
import org.keycloak.protocol.oidc.OIDCLoginProtocol;
import org.keycloak.services.managers.AuthenticationManager;

import java.util.Map;

public class OneLoginIdpPasswordAuthenticator extends PasswordForm {

    @Override
    public void authenticate(AuthenticationFlowContext context) {
        String loginHint = context.getAuthenticationSession().getClientNote(OIDCLoginProtocol.LOGIN_HINT_PARAM);
        MultivaluedMap<String, String> formData = new MultivaluedHashMap<>(Map.of(AuthenticationManager.FORM_USERNAME, loginHint));
        Response challengeResponse = context.form()
                .setFormData(formData)
                .createLoginPassword();
        context.challenge(challengeResponse);
    }

    @Override
    public void action(AuthenticationFlowContext context) {
        MultivaluedMap<String, String> queryParams = context.getHttpRequest().getUri().getQueryParameters(true);
        if (queryParams.containsKey("formAction") && "cancel".equals(queryParams.getFirst("formAction"))) {
            context.cancelLogin();
            return;
        }

        String loginHint = context.getAuthenticationSession().getClientNote(OIDCLoginProtocol.LOGIN_HINT_PARAM);
        UserModel user = Util.getUserByEmail(context, loginHint);
        if (user == null) {
            context.failure(AuthenticationFlowError.INVALID_USER);
            return;
        }

        FederatedIdentityModel federatedIdentity = Util.getFederatedIdentityForUser(context, user);

        if (federatedIdentity != null) {
            context.failure(AuthenticationFlowError.INVALID_USER);
        } else {
            super.action(context);
        }
    }
}
