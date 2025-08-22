package gov.uk.esos.keycloak.onelogin.broker.actiontoken;

import org.keycloak.authentication.actiontoken.DefaultActionToken;

public class OneLoginIdpVerifyEmailActionToken extends DefaultActionToken {
    public static final String TOKEN_TYPE = "one-login-idp-verify-email-action-token";

    public OneLoginIdpVerifyEmailActionToken(String userId, int absoluteExpirationInSecs, String compoundAuthenticationSessionId) {
        super(userId, TOKEN_TYPE, absoluteExpirationInSecs, null, compoundAuthenticationSessionId);
    }

    private OneLoginIdpVerifyEmailActionToken() {
        // Required to deserialize from JWT
        super();
    }
}
