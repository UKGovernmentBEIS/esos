package gov.uk.esos.keycloak.onelogin.broker.actiontoken;

import gov.uk.esos.keycloak.onelogin.broker.authenticator.OneLoginIdpEmailVerificationAuthenticator;
import jakarta.ws.rs.core.Response;
import org.keycloak.authentication.AuthenticationProcessor;
import org.keycloak.authentication.actiontoken.AbstractActionTokenHandler;
import org.keycloak.authentication.actiontoken.ActionTokenContext;
import org.keycloak.events.Errors;
import org.keycloak.events.EventType;
import org.keycloak.models.UserModel;
import org.keycloak.services.messages.Messages;
import org.keycloak.sessions.AuthenticationSessionModel;

public class OneLoginIdpVerifyEmailActionTokenHandler extends AbstractActionTokenHandler<OneLoginIdpVerifyEmailActionToken> {
    public OneLoginIdpVerifyEmailActionTokenHandler() {
        super(
                OneLoginIdpVerifyEmailActionToken.TOKEN_TYPE,
                OneLoginIdpVerifyEmailActionToken.class,
                Messages.STALE_VERIFY_EMAIL_LINK,
                EventType.VERIFY_EMAIL,
                Errors.INVALID_TOKEN
        );
    }

    @Override
    public Response handleToken(OneLoginIdpVerifyEmailActionToken token, ActionTokenContext<OneLoginIdpVerifyEmailActionToken> tokenContext) {
        UserModel user = tokenContext.getAuthenticationSession().getAuthenticatedUser();
        user.setEmailVerified(true);
        AuthenticationSessionModel authSession = tokenContext.getAuthenticationSession();
        authSession.setAuthNote(OneLoginIdpEmailVerificationAuthenticator.AUTH_NOTE_IDP_EMAIL_VERIFIED, "true");
        return tokenContext.brokerFlow(null, null, authSession.getAuthNote(AuthenticationProcessor.CURRENT_FLOW_PATH));
    }

    @Override
    public boolean canUseTokenRepeatedly(OneLoginIdpVerifyEmailActionToken token, ActionTokenContext<OneLoginIdpVerifyEmailActionToken> tokenContext) {
        return false;
    }
}
