package gov.uk.esos.keycloak.onelogin.broker.authenticator;

import gov.uk.esos.keycloak.onelogin.broker.Util;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import lombok.extern.jbosslog.JBossLog;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticationFlowError;
import org.keycloak.authentication.authenticators.browser.AbstractUsernameFormAuthenticator;
import org.keycloak.authentication.authenticators.browser.UsernamePasswordForm;
import org.keycloak.models.FederatedIdentityModel;
import org.keycloak.models.UserModel;
import org.keycloak.services.managers.AuthenticationManager;

import static org.keycloak.services.validation.Validation.FIELD_PASSWORD;

@JBossLog
public class OneLoginIdpUsernamePasswordAuthenticator extends UsernamePasswordForm {
    @Override
    public void action(AuthenticationFlowContext context) {
        MultivaluedMap<String, String> queryParams = context.getHttpRequest().getUri().getQueryParameters(true);
        if (queryParams.containsKey("formAction") && "cancel".equals(queryParams.getFirst("formAction"))) {
            context.cancelLogin();
            return;
        }

        MultivaluedMap<String, String> formData = context.getHttpRequest().getDecodedFormParameters();
        String username = formData.getFirst(AuthenticationManager.FORM_USERNAME);
        UserModel user = Util.getUserByEmail(context, username);
        if (user != null) {
            FederatedIdentityModel federatedIdentity = Util.getFederatedIdentityForUser(context, user);
            if (federatedIdentity != null) {
                Response challengeResponse = challenge(context, getDefaultChallengeMessage(context), FIELD_PASSWORD);
                context.getAuthenticationSession().setAuthNote(AbstractUsernameFormAuthenticator.ATTEMPTED_USERNAME, username);
                context.failureChallenge(AuthenticationFlowError.INVALID_CREDENTIALS, challengeResponse);
                return;
            }
        }

        super.action(context);
    }
}
