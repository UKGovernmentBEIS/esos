package gov.uk.esos.keycloak.onelogin.broker.authenticator;

import gov.uk.esos.keycloak.onelogin.broker.Util;
import gov.uk.esos.keycloak.onelogin.broker.actiontoken.OneLoginIdpVerifyEmailActionToken;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;
import jakarta.ws.rs.core.UriBuilderException;
import jakarta.ws.rs.core.UriInfo;
import lombok.extern.jbosslog.JBossLog;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticationFlowError;
import org.keycloak.authentication.AuthenticationProcessor;
import org.keycloak.authentication.actiontoken.verifyemail.VerifyEmailActionToken;
import org.keycloak.authentication.authenticators.broker.AbstractIdpAuthenticator;
import org.keycloak.authentication.authenticators.broker.util.SerializedBrokeredIdentityContext;
import org.keycloak.broker.provider.BrokeredIdentityContext;
import org.keycloak.common.util.Time;
import org.keycloak.email.EmailException;
import org.keycloak.email.EmailTemplateProvider;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.models.Constants;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.services.ServicesLogger;
import org.keycloak.services.Urls;
import org.keycloak.services.messages.Messages;
import org.keycloak.sessions.AuthenticationSessionCompoundId;
import org.keycloak.sessions.AuthenticationSessionModel;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@JBossLog
public class OneLoginIdpEmailVerificationAuthenticator extends AbstractIdpAuthenticator {
    public static final String AUTH_NOTE_IDP_EMAIL_VERIFIED = "AUTH_NOTE_IDP_EMAIL_VERIFIED";

    @Override
    protected void authenticateImpl(AuthenticationFlowContext context, SerializedBrokeredIdentityContext serializedCtx, BrokeredIdentityContext brokerContext) {
        KeycloakSession session = context.getSession();
        RealmModel realm = context.getRealm();
        AuthenticationSessionModel authSession = context.getAuthenticationSession();

        if ("true".equals(authSession.getAuthNote(AUTH_NOTE_IDP_EMAIL_VERIFIED))) {
            authSession.removeAuthNote(AUTH_NOTE_IDP_EMAIL_VERIFIED);
            context.success();
            return;
        }

        if (realm.getSmtpConfig().isEmpty()) {
            ServicesLogger.LOGGER.smtpNotConfigured();
            context.attempted();
            return;
        }

        String existingUserEmail = authSession.getAuthNote(Util.AUTH_NOTE_INVALID_USER_EXISTING_USER);
        String attemptingUserEmail = authSession.getAuthNote(Util.AUTH_NOTE_INVALID_USER_ATTEMPTING_USER);
        UserModel existingUser = session.users().getUserByEmail(realm, existingUserEmail);
        Optional<UserModel> user = Optional.ofNullable(context.getUser());
        String userEmail = user.map(UserModel::getEmail).orElse(existingUserEmail);

        // Do not allow resending e-mail by simple page refresh
        if (!Objects.equals(authSession.getAuthNote(Constants.VERIFY_EMAIL_KEY), userEmail)) {
            authSession.setAuthNote(Constants.VERIFY_EMAIL_KEY, userEmail);

            if (existingUser != null) {
                sendWarningEmail(session, context, brokerContext, existingUser, attemptingUserEmail);
            } else {
                sendVerifyEmail(session, context, brokerContext);
            }
        } else {
            showEmailSentPage(context, brokerContext, userEmail);
        }
    }

    @Override
    protected void actionImpl(AuthenticationFlowContext context, SerializedBrokeredIdentityContext serializedCtx, BrokeredIdentityContext brokerContext) {
        log.debugf("Re-sending email requested for user, details follow");

        // This will allow user to re-send email again
        context.getAuthenticationSession().removeAuthNote(Constants.VERIFY_EMAIL_KEY);

        authenticateImpl(context, serializedCtx, brokerContext);
    }

    @Override
    public boolean requiresUser() {
        return false;
    }

    @Override
    public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
        return true;
    }

    private void sendWarningEmail(KeycloakSession session, AuthenticationFlowContext context, BrokeredIdentityContext brokerContext, UserModel existingUser, String attemptingUserEmail) {
        RealmModel realm = session.getContext().getRealm();

        try {
            session.getProvider(EmailTemplateProvider.class)
                    .setRealm(realm)
                    .setUser(existingUser)
                    .setAuthenticationSession(context.getAuthenticationSession())
                    .send("idpEmailWarningSubject", "idp-warning-email.ftl", new HashMap<>(Map.of("attacker", attemptingUserEmail)));
        } catch (EmailException e) {
            ServicesLogger.LOGGER.confirmBrokerEmailFailed(e);
            Response challenge = context.form()
                    .setError(Messages.EMAIL_SENT_ERROR)
                    .createErrorPage(Response.Status.INTERNAL_SERVER_ERROR);
            context.failure(AuthenticationFlowError.INTERNAL_ERROR, challenge);
            return;
        }

        showEmailSentPage(context, brokerContext, existingUser.getEmail());
    }

    private void sendVerifyEmail(KeycloakSession session, AuthenticationFlowContext context, BrokeredIdentityContext brokerContext) throws UriBuilderException, IllegalArgumentException {
        RealmModel realm = session.getContext().getRealm();
        UriInfo uriInfo = session.getContext().getUri();
        AuthenticationSessionModel authSession = context.getAuthenticationSession();
        UserModel user = context.getUser();

        int validityInSecs = realm.getActionTokenGeneratedByUserLifespan(VerifyEmailActionToken.TOKEN_TYPE);
        int absoluteExpirationInSecs = Time.currentTime() + validityInSecs;

        String authSessionEncodedId = AuthenticationSessionCompoundId.fromAuthSession(authSession).getEncodedId();
        OneLoginIdpVerifyEmailActionToken token = new OneLoginIdpVerifyEmailActionToken(user.getId(), absoluteExpirationInSecs, authSessionEncodedId);

        UriBuilder builder = Urls.actionTokenBuilder(uriInfo.getBaseUri(), token.serialize(session, realm, uriInfo),
                authSession.getClient().getClientId(), authSession.getTabId(), AuthenticationProcessor.getClientData(session, authSession));

        String link = builder
                .queryParam(Constants.EXECUTION, context.getExecution().getId())
                .build(realm.getName()).toString();

        try {
            session.getProvider(EmailTemplateProvider.class)
                    .setRealm(realm)
                    .setAuthenticationSession(authSession)
                    .setUser(user)
                    .send("idpEmailVerificationSubject", "idp-verification-email.ftl", new HashMap<>(Map.of("link", link)));
        } catch (EmailException e) {
            ServicesLogger.LOGGER.confirmBrokerEmailFailed(e);
            Response challenge = context.form()
                    .setError(Messages.EMAIL_SENT_ERROR)
                    .createErrorPage(Response.Status.INTERNAL_SERVER_ERROR);
            context.failure(AuthenticationFlowError.INTERNAL_ERROR, challenge);
            return;
        }

        showEmailSentPage(context, brokerContext, user.getEmail());
    }

    private void showEmailSentPage(AuthenticationFlowContext context, BrokeredIdentityContext brokerContext, String email) {
        int validityInSecs = context.getRealm().getActionTokenGeneratedByUserLifespan(VerifyEmailActionToken.TOKEN_TYPE);
        long linkExpirationHours = TimeUnit.SECONDS.toHours(validityInSecs);

        Response challenge = context.form()
                .setStatus(Response.Status.OK)
                .setAttribute(LoginFormsProvider.IDENTITY_PROVIDER_BROKER_CONTEXT, brokerContext)
                .setExecution(context.getExecution().getId())
                .setAttribute("email", email)
                .setAttribute("linkExpirationHours", linkExpirationHours)
                .createForm("idp-verification-email-sent.ftl");

        context.forceChallenge(challenge);
    }
}
