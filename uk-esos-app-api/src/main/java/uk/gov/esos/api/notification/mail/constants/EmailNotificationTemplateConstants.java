package uk.gov.esos.api.notification.mail.constants;

import lombok.experimental.UtilityClass;

/**
 * Encapsulates constants related to Notification Templates.
 */
@UtilityClass
public final class EmailNotificationTemplateConstants {

    //Placeholders for Email Notification Templates
    public static final String EMAIL_CONFIRMATION_LINK = "emailConfirmationLink";
    public static final String USER_ACCOUNT_CREATED_USER_FNAME = "userFirstName";
    public static final String USER_ACCOUNT_CREATED_USER_LNAME = "userLastName";
    public static final String USER_ACCOUNT_CREATED_USER_EMAIL = "userEmail";
    public static final String ACCOUNT_APPLICATION_REJECTED_REASON = "reason";
    public static final String ACCOUNT_NAME = "accountName";
    public static final String ACCOUNT_ID = "accountId";
    public static final String ACCOUNT_PRIMARY_CONTACT = "accountPrimaryContact";
    public static final String EMITTER_ID = "emitterId";

    public static final String COMPETENT_AUTHORITY_EMAIL = "competentAuthorityEmail";
    public static final String COMPETENT_AUTHORITY_NAME = "competentAuthorityName";
    public static final String APPLICANT_FNAME = "applicantFirstName";
    public static final String APPLICANT_LNAME = "applicantLastName";
    public static final String USER_ROLE_TYPE = "userRoleType";
    public static final String OPERATOR_INVITATION_CONFIRMATION_LINK = "operatorInvitationConfirmationLink";
    public static final String REGULATOR_INVITATION_CONFIRMATION_LINK = "regulatorInvitationConfirmationLink";
    public static final String VERIFIER_INVITATION_CONFIRMATION_LINK = "verifierInvitationConfirmationLink";
    public static final String CHANGE_2FA_LINK = "change2FALink";
    public static final String RESET_PASSWORD_LINK = "resetPasswordLink";
    public static final String CONTACT_REGULATOR = "contactRegulator";
    public static final String USER_INVITEE_FNAME = "userInviteeFirstName";
    public static final String USER_INVITEE_LNAME = "userInviteeLastName";
    public static final String EXPIRATION_MINUTES = "expirationMinutes";
    
    public static final String WORKFLOW_ID = "workflowId";
    public static final String WORKFLOW = "workflow";
    public static final String WORKFLOW_TASK = "workflowTask";
    public static final String WORKFLOW_USER = "workflowUser";
    public static final String WORKFLOW_DEADLINE = "deadline";
    public static final String WORKFLOW_EXPIRATION_TIME = "expirationTime";
    public static final String WORKFLOW_EXPIRATION_TIME_LONG = "expirationTimeLong";

    public static final String USER_FEEDBACK_TIMESTAMP = "timestamp";
    public static final String USER_FEEDBACK_SATISFACTION_RATE = "satisfactionRate";
    public static final String USER_FEEDBACK_SATISFACTION_RATE_REASON = "satisfactionRateReason";
    public static final String USER_FEEDBACK_USER_REGISTRATION_RATE = "userRegistrationRate";
    public static final String USER_FEEDBACK_USER_REGISTRATION_RATE_REASON = "userRegistrationRateReason";
    public static final String USER_FEEDBACK_ONLINE_GUIDANCE_RATE = "onlineGuidanceRate";
    public static final String USER_FEEDBACK_ONLINE_GUIDANCE_RATE_REASON = "onlineGuidanceRateReason";
    public static final String USER_FEEDBACK_CREATING_ACCOUNT_RATE = "creatingAccountRate";
    public static final String USER_FEEDBACK_CREATING_ACCOUNT_RATE_REASON = "creatingAccountRateReason";
    public static final String USER_FEEDBACK_ONBOARD_RATE = "onBoardingRate";
    public static final String USER_FEEDBACK_ONBOARD_RATE_REASON = "onBoardingRateReason";
    public static final String USER_FEEDBACK_TASKS_RATE = "tasksRate";
    public static final String USER_FEEDBACK_TASKS_RATE_REASON = "tasksRateReason";
    public static final String USER_FEEDBACK_IMPROVEMENT_SUGGESTION = "improvementSuggestion";

    public static final String ACCOUNT_CLOSURE_JUSTIFICATION = "justification";

    public static final String DOMAIN_URL = "domainUrl";

    public static final String HOME_URL = "homeUrl";

    public static final String ESOS_HELPDESK = "esosHelpdesk";

}
