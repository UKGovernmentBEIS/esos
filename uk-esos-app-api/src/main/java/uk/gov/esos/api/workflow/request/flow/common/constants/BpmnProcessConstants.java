package uk.gov.esos.api.workflow.request.flow.common.constants;

import lombok.experimental.UtilityClass;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestExpirationType;

/**
 * Encapsulates constants related to BPMN Process
 */
@UtilityClass
public class BpmnProcessConstants {
    
    public static final String _EXPIRATION_DATE = "ExpirationDate";
    public static final String _FIRST_REMINDER_DATE = "FirstReminderDate";
    public static final String _SECOND_REMINDER_DATE = "SecondReminderDate";

    public static final String REQUEST_ID = "requestId";
    public static final String REQUEST_STATUS = "requestStatus";
    public static final String REQUEST_TASK_TYPE = "requestTaskType";
    public static final String REQUEST_TASK_ASSIGNEE = "requestTaskAssignee";
    public static final String REQUEST_TYPE = "requestType";
    public static final String REQUEST_TYPE_DYNAMIC_TASK_PREFIX = "requestTypeDynamicTaskPrefix";
    public static final String REQUEST_INITIATOR_ROLE_TYPE = "requestInitiatorRoleType";
    public static final String REQUEST_DELETE_UPON_TERMINATE = "requestDeleteUponTerminate";
    public static final String BUSINESS_KEY = "businessKey";

    public static final String VERIFICATION_BODY_STATE_CHANGED = "verificationBodyStateChanged";

    public static final String ACCOUNT_ID = "accountId";
    public static final String ACCOUNT_IDS = "accountIds";

    // account opening
    public static final String APPLICATION_APPROVED = "applicationApproved";
    public static final String EXISTS_VERIFIED_REGISTRATION_NUMBER = "existsVerifiedRegistrationNumber";
    
    // application review
    public static final String APPLICATION_REVIEW_EXPIRATION_DATE = RequestExpirationType.APPLICATION_REVIEW.getCode() + _EXPIRATION_DATE;
    public static final String REVIEW_DETERMINATION = "reviewDetermination";
    public static final String REVIEW_OUTCOME = "reviewOutcome";
    
    // rfi
    public static final String RFI_REQUESTED = "rfiRequested";
    public static final String RFI_START_TIME = "rfiStartTime";
    public static final String RFI_EXPIRATION_DATE = RequestExpirationType.RFI.getCode() + _EXPIRATION_DATE;
    public static final String RFI_FIRST_REMINDER_DATE = RequestExpirationType.RFI.getCode() + _FIRST_REMINDER_DATE;
    public static final String RFI_SECOND_REMINDER_DATE = RequestExpirationType.RFI.getCode() + _SECOND_REMINDER_DATE;
    public static final String RFI_OUTCOME = "rfiOutcome";

    // Request for Determination Extension (RDE)
    public static final String RDE_REQUESTED = "rdeRequested";
    public static final String RDE_EXPIRATION_DATE = RequestExpirationType.RDE.getCode() + _EXPIRATION_DATE;
    public static final String RDE_FIRST_REMINDER_DATE = RequestExpirationType.RDE.getCode() + _FIRST_REMINDER_DATE;
    public static final String RDE_SECOND_REMINDER_DATE = RequestExpirationType.RDE.getCode() + _SECOND_REMINDER_DATE;
    public static final String RDE_OUTCOME = "rdeOutcome";
    
    //payment
    public static final String PAYMENT_AMOUNT = "paymentAmount";
    public static final String PAYMENT_OUTCOME = "paymentOutcome";
    public static final String PAYMENT_REVIEW_OUTCOME = "paymentReviewOutcome";
    public static final String PAYMENT_EXPIRES = "paymentExpires";
    public static final String SKIP_PAYMENT = "skipPayment";
    public static final String PAYMENT_EXPIRATION_DATE = RequestExpirationType.PAYMENT.getCode() + _EXPIRATION_DATE;

    // messaging
    public static final String PROCESS_TO_MESSAGE_BUSINESS_KEY = "processToMessageBusinessKey";
    public static final String VARIABLES = "variables";

    // NOC
    public static final String NOC_OUTCOME= "nocOutcome";

    // ACTION PLAN
    public static final String ACTION_PLAN_OUTCOME= "apOutcome";

    // PROGRESS UPDATE 1
    public static final String PROGRESS_UPDATE_1_OUTCOME= "pu1Outcome";

    // PROGRESS UPDATE 2
    public static final String PROGRESS_UPDATE_2_OUTCOME= "pu2Outcome";

}
