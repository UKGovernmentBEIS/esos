package gov.uk.esos.keycloak.onelogin.broker.authenticator;

import gov.uk.esos.keycloak.onelogin.broker.Util;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.authenticators.broker.AbstractIdpAuthenticator;
import org.keycloak.authentication.authenticators.broker.util.SerializedBrokeredIdentityContext;
import org.keycloak.broker.provider.BrokeredIdentityContext;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.utils.FormMessage;
import org.keycloak.utils.EmailValidationUtil;

public class OneLoginIdpNewUserInfoAuthenticator extends AbstractIdpAuthenticator {
    @Override
    protected void authenticateImpl(AuthenticationFlowContext context, SerializedBrokeredIdentityContext serializedCtx, BrokeredIdentityContext brokerContext) {
        if (context.getUser() != null) {
            context.success();
        } else {
            Response challengeResponse = context.form().createForm("idp-new-user-info.ftl");
            context.challenge(challengeResponse);
        }
    }

    @Override
    protected void actionImpl(AuthenticationFlowContext context, SerializedBrokeredIdentityContext serializedCtx, BrokeredIdentityContext brokerContext) {
        MultivaluedMap<String, String> queryParams = context.getHttpRequest().getUri().getQueryParameters(true);
        if (queryParams.containsKey("formAction") && "cancel".equals(queryParams.getFirst("formAction"))) {
            context.cancelLogin();
            return;
        }

        KeycloakSession session = context.getSession();
        MultivaluedMap<String, String> formData = context.getHttpRequest().getDecodedFormParameters();
        if (formData.containsKey("cancel")) {
            context.cancelLogin();
            return;
        }

        String email = formData.getFirst("email");
        String firstName = formData.getFirst("firstName");
        String lastName = formData.getFirst("lastName");

        UserModel existingUser = session.users().getUserByEmail(context.getRealm(), email);

        Response validationErrorResponse = checkFormValid(context, email, firstName, lastName);
        if (validationErrorResponse != null) {
            context.challenge(validationErrorResponse);
        } else {
            if (existingUser == null) {
                UserModel newUser = session.users().addUser(context.getRealm(), email);
                newUser.setEmail(email);
                newUser.setFirstName(firstName);
                newUser.setLastName(lastName);
                newUser.setEnabled(true);
                context.setUser(newUser);
                context.getEvent().detail(Util.EVENT_DETAIL_TEMP_USER_FOR_CREATION, email);
            } else {
                // We need to continue the flow so we can send a warning email to existing user
                context.getAuthenticationSession().setAuthNote(Util.AUTH_NOTE_INVALID_USER_EXISTING_USER, existingUser.getEmail());
                context.getAuthenticationSession().setAuthNote(Util.AUTH_NOTE_INVALID_USER_ATTEMPTING_USER, email);
            }

            context.success();
        }
    }

    @Override
    public boolean requiresUser() {
        return false;
    }

    @Override
    public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
        return false;
    }

    private Response checkFormValid(AuthenticationFlowContext context, String email, String firstName, String lastName) {
        LoginFormsProvider formsProvider = context.form();
        boolean valid = true;

        if (email == null || email.isBlank() || !EmailValidationUtil.isValidEmail(email)) {
            valid = false;
            formsProvider.addError(new FormMessage("email", "You must provide a valid email address."));
        }

        if (firstName == null || firstName.isBlank()) {
            valid = false;
            formsProvider.addError(new FormMessage("firstName", "You must provide a first name."));

        }

        if (lastName == null || lastName.isBlank()) {
            valid = false;
            formsProvider.addError(new FormMessage("lastName", "You must provide a last name."));
        }

        if (!valid) {
            return formsProvider.createForm("idp-new-user-info.ftl");
        }

        return null;
    }
}
