package gov.uk.esos.keycloak.onelogin.broker.requiredaction;

import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.keycloak.Config;
import org.keycloak.authentication.CredentialRegistrator;
import org.keycloak.authentication.RequiredActionContext;
import org.keycloak.authentication.RequiredActionFactory;
import org.keycloak.authentication.RequiredActionProvider;
import org.keycloak.authentication.authenticators.util.AuthenticatorUtils;
import org.keycloak.events.Errors;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.models.UserCredentialModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.credential.PasswordCredentialModel;
import org.keycloak.models.utils.FormMessage;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.services.managers.AuthenticationManager;
import org.keycloak.services.managers.BruteForceProtector;
import org.keycloak.services.messages.Messages;
import org.keycloak.services.validation.Validation;
import org.keycloak.sessions.AuthenticationSessionModel;

public class OneLoginIdpVerifyPassword implements RequiredActionProvider, RequiredActionFactory, CredentialRegistrator {
    public static final String ID = "OL_IDP_VERIFY_PASSWORD";

    @Override
    public void requiredActionChallenge(RequiredActionContext context) {
        UserModel user = context.getUser();
        Response challenge = context.form()
                .setAttribute("email", user.getEmail())
                .createForm("idp-verify-password.ftl");
        context.challenge(challenge);
    }

    @Override
    public void processAction(RequiredActionContext context) {
        UserModel user = context.getUser();
        MultivaluedMap<String, String> formData = context.getHttpRequest().getDecodedFormParameters();
        boolean validPassword = validatePassword(context, user, formData);
        if (validPassword) {
            context.success();
        }
    }

    @Override
    public String getCredentialType(KeycloakSession session, AuthenticationSessionModel authenticationSession) {
        return PasswordCredentialModel.TYPE;
    }

    @Override
    public String getDisplayText() {
        return "Verify Password";
    }

    @Override
    public void evaluateTriggers(RequiredActionContext context) {

    }

    @Override
    public RequiredActionProvider create(KeycloakSession session) {
        return this;
    }

    @Override
    public void init(Config.Scope config) {

    }

    @Override
    public void postInit(KeycloakSessionFactory factory) {

    }

    @Override
    public void close() {

    }

    @Override
    public String getId() {
        return ID;
    }

    private Response createLoginForm(LoginFormsProvider form, UserModel user) {
        return form.setAttribute("email", user.getEmail()).createForm("idp-verify-password.ftl");
    }

    private Response challenge(RequiredActionContext context, String error) {
        return challenge(context, error, null);
    }

    private Response challenge(RequiredActionContext context, String error, String field) {
        LoginFormsProvider form = context.form();
        if (error != null) {
            if (field != null) {
                form.addError(new FormMessage(field, error));
            } else {
                form.setError(error);
            }
        }
        return createLoginForm(form, context.getUser());
    }

    private boolean validatePassword(RequiredActionContext context, UserModel user, MultivaluedMap<String, String> inputData) {
        String password = inputData.getFirst(CredentialRepresentation.PASSWORD);
        if (password == null || password.isEmpty()) {
            return badPasswordHandler(context, user, true);
        }

        if (isDisabledByBruteForce(context, user)) return false;

        if (user.credentialManager().isValid(UserCredentialModel.password(password))) {
            context.getAuthenticationSession().setAuthNote(AuthenticationManager.PASSWORD_VALIDATED, "true");
            return true;
        } else {
            return badPasswordHandler(context, user, false);
        }
    }

    private boolean badPasswordHandler(RequiredActionContext context, UserModel user, boolean isEmptyPassword) {
        BruteForceProtector protector = context.getSession().getProvider(BruteForceProtector.class);
        context.getEvent().user(user);
        context.getEvent().error(Errors.INVALID_USER_CREDENTIALS);

        Response challengeResponse = challenge(context, Messages.INVALID_PASSWORD, Validation.FIELD_PASSWORD);
        if (!isEmptyPassword) {
            protector.failedLogin(context.getRealm(), user, context.getSession().getContext().getConnection(), context.getSession().getContext().getUri());
        }

        context.challenge(challengeResponse);
        return false;
    }

    private boolean isDisabledByBruteForce(RequiredActionContext context, UserModel user) {
        BruteForceProtector protector = context.getSession().getProvider(BruteForceProtector.class);
        String bruteForceError = AuthenticatorUtils.getDisabledByBruteForceEventError(protector, context.getSession(), context.getRealm(), user);

        if (bruteForceError != null) {
            context.getEvent().user(user);
            context.getEvent().error(bruteForceError);
            Response challengeResponse = challenge(context, disabledByBruteForceError(bruteForceError), Validation.FIELD_USERNAME);
            context.challenge(challengeResponse);
            return true;
        }

        return false;
    }

    private String disabledByBruteForceError(String error) {
        if (Errors.USER_TEMPORARILY_DISABLED.equals(error)) {
            return Messages.ACCOUNT_TEMPORARILY_DISABLED;
        }
        return Messages.ACCOUNT_PERMANENTLY_DISABLED;
    }
}
