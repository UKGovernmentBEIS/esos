package uk.gov.esos.api.notification.template.domain.enumeration;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

/**
 * Enumerates the various notification template names.
 */
@Getter
@AllArgsConstructor
public enum NotificationTemplateName {

    //Email Notification Template Names
    EMAIL_CONFIRMATION("EmailConfirmation"),
    USER_ACCOUNT_CREATED("UserAccountCreated"),
    USER_ACCOUNT_ACTIVATION("UserAccountActivation"),
    ACCOUNT_APPLICATION_APPROVED("AccountApplicationApproved"),
    ACCOUNT_APPLICATION_REJECTED("AccountApplicationRejected"),
    ORGANISATION_ACCOUNT_CREATED("OrganisationAccountCreated"),
    INVITATION_TO_OPERATOR_ACCOUNT("InvitationToOperatorAccount"),
    INVITATION_TO_REGULATOR_ACCOUNT("InvitationToRegulatorAccount"),
    INVITATION_TO_VERIFIER_ACCOUNT("InvitationToVerifierAccount"),
    INVITEE_INVITATION_ACCEPTED("InviteeInvitationAccepted"),
    INVITER_INVITATION_ACCEPTED("InviterInvitationAccepted"),
    CHANGE_2FA("Change2FA"),
    RESET_PASSWORD_REQUEST("ResetPasswordRequest"),
    RESET_PASSWORD_CONFIRMATION("ResetPasswordConfirmation"),
    RESET_2FA_CONFIRMATION("Reset2FaConfirmation"),
    VERIFIED_ACCOUNT_INVITATION("VerifiedAccountInvitation"),
    
    GENERIC_EMAIL("Generic email template"),
    GENERIC_EXPIRATION_REMINDER("Generic Expiration Reminder Template"),

    USER_FEEDBACK("UserFeedbackForService"),

    EMAIL_ASSIGNED_TASK("EmailAssignedTask"),

    ACCOUNT_CLOSED("AccountClosed");


    /** The name. */
    private final String name;

    /** Maps keys representing values of name property to NotificationTemplate values . */
    private static final Map<String, NotificationTemplateName> BY_NAME = new HashMap<>();

    static {
        for (NotificationTemplateName e : values()) {
            BY_NAME.put(e.name, e);
        }
    }

    /**
     * Retrieves NotificationTemplateName value from the provided name.
     * @param name name attribute
     * @return NotificationTemplateName value
     */
    public static NotificationTemplateName getEnumValueFromName(String name) {
        return BY_NAME.get(name);
    }
}
