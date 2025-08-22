package uk.gov.esos.api.web.constants;

import lombok.experimental.UtilityClass;

/**
 * Encapsulates constants related to Swagger
 */
@UtilityClass
public final class SwaggerApiInfo {

    // Response Messages
    public static final String ERROR_CODES_HEADER = "\t\n Error Code | Description \t\n";
    public static final String OK = "OK";
    public static final String NO_CONTENT = "No Content";
    public static final String BAD_REQUEST = "Bad Request";
    public static final String NOT_FOUND = "Not Found";
    public static final String FORBIDDEN = "Forbidden";
    public static final String INTERNAL_SERVER_ERROR = "Internal Server Error";
    public static final String SERVICE_UNAVAILABLE = "Service unavailable";
    public static final String VALIDATION_ERROR_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "FORM1001 | Form validation failed";
    public static final String VALIDATION_PARAMETER_ERROR_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "FORM1002 | Parameters validation failed";
    public static final String TOKEN_VERIFICATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
            "EMAIL1001 | The verification link has expired \t\n " +
            "TOKEN1001 | Invalid Token";
    public static final String USERS_INVITATION_TOKEN_VERIFICATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
            "AUTHORITY1005 | User status cannot be updated \t\n " +
            "EMAIL1001 | The verification link has expired \t\n " +
            "TOKEN1001 | Invalid Token \t\n " +
            "FORM1001 | Form validation failed";
    public static final String USERS_TOKEN_VERIFICATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "USER1001 | User is already registered \t\n " +
        "EMAIL1001 | The verification link has expired \t\n " +
        "TOKEN1001 | Invalid Token \t\n " +
        "FORM1001 | Form validation failed";
    public static final String ACCEPT_OPERATOR_INVITATION_TOKEN_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
            "EMAIL1001 | The verification link has expired \t\n " +
            "TOKEN1001 | Invalid Token \t\n " + 
            "TOKEN1002 | Invalid Token - User is not the invitee \t\n " + 
            "USER1002 | User is deleted \t\n " +
            "NOTFOUND1001 | Resource not found \t\n " +
            "AUTHORITY1009 | User is not operator \t\n ";
    public static final String REQUEST_ACTION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "FORM1001 | Form validation failed \t\n " +
        "REQUEST_CREATE_ACTION1000 | Request create action not allowed \t\n " +
        "ACCOUNT1001 | Account registration number already exists \t\n "
        ;
    public static final String REQUEST_TASK_ACTION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "FORM1001 | Form validation failed \t\n " +
        "FORM1002 | Attachment not found \t\n " +
        "REQUEST_TASK_ACTION1000 | Request task action cannot proceed \t\n " +
        "REQUEST_TASK_ACTION1001 | User is not the assignee of the request task \t\n " +
        "ACCOUNT1001 | Account registration number already exists \t\n " +
        "ACCOUNT1009 | Account status is not valid \t\n " +
        "PERMIT1001 | Permit is in invalid state \t\n " +
        "PERMIT1002 | Invalid Permit review \t\n " +
        "PERMIT1003 | Invalid Permit \t\n " +
        "PERMIT1004 | Invalid Permit Variation Review \t\n " +
        "PERMITSURRENDER1001 | Invalid Permit surrender \t\n " 
        ;
    public static final String REQUEST_TASK_ASSIGNMENT_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "ITEM1000 | Can not assign request to the provided user \t\n" +
        "ITEM1001 | Request task is not assignable";
    public static final String REQUEST_TASK_UPLOAD_ATTACHMENT_ACTION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "PERMIT1001 | Permit is in invalid state \t\n " + 
        "FILE1001 | Virus found in input stream \t\n " +
        "FILE1002 | File size is less than minimum \t\n " + 
        "FILE1003 | File size is greater than maximum \t\n" +
        "FILE1004 | File upload failed"  
        ;
    public static final String UPDATE_ACCOUNT_OPERATOR_AUTHORITY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "ROLE1000 | Invalid operator role code \t\n " +
        "AUTHORITY1001 | At least one operator admin should exist in account \t\n " +
        "AUTHORITY1004 | User is not related to account \t\n " +
        "AUTHORITY1008 | Authority status in not valid \t\n " +
        "AUTHORITY1012 | User role can not be modified \t\n" +
        "ACCOUNT_CONTACT1001 | You must have a primary contact on your account \t\n" +
        "ACCOUNT_CONTACT1002 | You must have a financial contact on your account \t\n" +
        "ACCOUNT_CONTACT1003 | You must have a service contact on your account \t\n" +
        "ACCOUNT_CONTACT1004 | You cannot assign the same user as a primary and secondary contact on your account \t\n" +
        "ACCOUNT_CONTACT1005 | You cannot assign a Restricted user as primary contact on your account \t\n" +
        "ACCOUNT_CONTACT1006 | You cannot assign a Restricted user as secondary contact on your account";
    public static final String AUTHORITY_USER_NOT_RELATED_TO_CA = BAD_REQUEST + ERROR_CODES_HEADER +
        "AUTHORITY1003 | User is not related to competent authority";
    public static final String AUTHORITY_USER_NOT_RELATED_TO_ACCOUNT = BAD_REQUEST + ERROR_CODES_HEADER +
            "AUTHORITY1004 | User is not related to account";
    public static final String AUTHORITY_USER_NOT_RELATED_TO_VERIFICATION_BODY = BAD_REQUEST + ERROR_CODES_HEADER +
            "AUTHORITY1006 | User is not related to verification body";
    public static final String UPDATE_REGULATOR_USER_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "AUTHORITY1003 | User is not related to competent authority \t\n " +
        "INVALID_IMAGE_DIMENSIONSIMAGE1001 | Image dimensions are not valid \t\n " +
        "FILE1002 | File size is less than minimum \t\n " +
        "FILE1003 | File size is greater than maximum \t\n " +
        "FILE1005 | File type is not accepted \t\n " +
        "FORM1001 | Form validation failed";
    public static final String OPERATOR_USER_ACCOUNT_REGISTRATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "FORM1001 | Form validation failed \t\n " +
        "AUTHORITY1000 | Can not assign authority. Another role is already assigned to user \t\n " +
        "AUTHORITY1005 | User status cannot be updated \t\n " +
        "AUTHORITY1011 | Regulator user can only add operator administrator users to an account \t\n " +
        "USER1000 | User registration failed \t\n " +
        "USER1001 | User is already registered";
    public static final String DELETE_ACCOUNT_OPERATOR_AUTHORITY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "AUTHORITY1001 | At least one operator admin should exist in account \t\n " +
        "AUTHORITY1004 | User is not related to account";
    public static final String UPDATE_VERIFIER_AUTHORITY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "AUTHORITY1007 | Active verifier admin should exist \t\n " +
        "AUTHORITY1008 | Authority status in not valid";
    public static final String ACCEPT_REGULATOR_USER_INVITATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "EMAIL1001 | The verification link has expired \t\n " +
        "TOKEN1001 | Invalid Token \t\n " +
        "TOKEN1002 | Invalid Token - User is not the invitee \t\n " +
        "USER1004 | User status is not valid ";
    public static final String ENABLE_REGULATOR_USER_FROM_INVITATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "FORM1001 | Form validation failed \t\n " +
        "EMAIL1001 | The verification link has expired \t\n " +
        "TOKEN1001 | Invalid Token \t\n " +
        "USER1004 | User status is not valid ";
    public static final String ACCEPT_VERIFIER_USER_INVITATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "EMAIL1001 | The verification link has expired \t\n " +
        "TOKEN1001 | Invalid Token \t\n " +
        "USER1004 | User status is not valid ";
    public static final String ENABLE_VERIFIER_USER_FROM_INVITATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "FORM1001 | Form validation failed \t\n " +
        "EMAIL1001 | The verification link has expired \t\n " +
        "TOKEN1001 | Invalid Token \t\n " +
        "USER1004 | User status is not valid ";
    public static final String UPDATE_CA_SITE_CONTACTS_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
            "AUTHORITY1003 | User is not related to competent authority \t\n " +
            "ACCOUNT1004 | Account is not related to competent authority \t\n " +
            "FORM1001 | Form validation failed";
    public static final String UPDATE_VB_SITE_CONTACTS_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
            "AUTHORITY1006 | User is not related to verification body \t\n " +
            "ACCOUNT1005 | Account is not related to verification body \t\n " +
            "FORM1001 | Form validation failed";
    public static final String APPOINT_VERIFICATION_BODY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
            "ACCOUNT1006 | A verification body has already been appointed to the Installation account \t\n " +
            "ACCOUNT1008 | The verification body is not accredited to the account's emission trading scheme \t\n " +
            "ACCOUNT1009 | Account status is not valid \t\n " +
            "ACCOUNT1010 | Verification body is attached on open tasks \t\n " +
            "NOTIF1000 | Template processing failed \t\n " +
            "NOTFOUND1001 | Resource not found \t\n " +
            "FORM1001 | Form validation failed";
    public static final String REAPPOINT_VERIFICATION_BODY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
            "ACCOUNT1006 | A verification body has already been appointed to the Installation account \t\n " +
            "ACCOUNT1007 | A verification body has not been appointed to the Installation account \t\n " +
            "ACCOUNT1009 | Account status is not valid \t\n " +
            "ACCOUNT1008 | The verification body is not accredited to the account's emission trading scheme \t\n " +
            "ACCOUNT1010 | Verification body is attached on open tasks \t\n " +
            "NOTIF1000 | Template processing failed \t\n " +
            "NOTFOUND1001 | Resource not found \t\n " +
            "FORM1001 | Form validation failed";
    public static final String CREATE_VERIFICATION_BODY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "FORM1001 | Form validation failed \t\n " +
        "USER1001 | User is already registered \t\n " +
        "AUTHORITY1005 | User status cannot be updated ";
    public static final String UPDATE_VERIFICATION_BODY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "FORM1001 | Form validation failed \t\n " +
        "VERBODY1001 | Accreditation reference number already exists ";
    public static final String INVITE_ADMIN_VERIFIER_TO_VB_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
            "FORM1001 | Form validation failed \t\n " +
            "NOTFOUND1001 | Resource not found \t\n " +
            "USER1001 | User is already registered ";
    public static final String REGISTER_OPERATOR_USER_FROM_INVITATION_WOUT_CREDENTIALS_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "AUTHORITY1005 | User status cannot be updated \t\n " +
        "EMAIL1001 | The verification link has expired \t\n " +
        "TOKEN1001 | Invalid Token \t\n " +
        "FORM1001 | Form validation failed";
    public static final String UPDATE_VERIFICATION_BODY_STATUS_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
            "FORM1001 | Form validation failed \t\n " +
            "VERBODY1002 | Verification body status is not valid";
    public static final String ENABLE_OPERATOR_USER_FROM_INVITATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "USER1004 | User status is not valid \t\n " +
        "EMAIL1001 | The verification link has expired \t\n " +
        "TOKEN1001 | Invalid Token \t\n " +
        "FORM1001 | Form validation failed";
    public static final String REQUEST_TO_CHANGE_2FA_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "OTP1001 | Invalid OTP \t\n " +
        "FORM1001 | Form validation failed";
    public static final String REMOVE_2FA_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "TOKEN1001 | Invalid Token \t\n " +
        "EMAIL1001 | The verification link has expired \t\n " +
        "USER1005 | User not exist \t\n " +
        "FORM1001 | Form validation failed";
    public static final String REQUEST_RESET_PASSWORD_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
         "OTP1001 | Invalid OTP \t\n " +
         "FORM1001 | Form validation failed";
    public static final String RESET_PASSWORD_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
         "TOKEN1001 | Invalid Token \t\n " +
         "USER1005 | User not exist \t\n " +
         "USER1004 | User status is not valid \t\n " +
         "OTP1001 | Invalid OTP \t\n " +
         "FORM1001 | Form validation failed";
    public static final String DELETE_CURRENT_VERIFIER_AUTHORITY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "AUTHORITY1006 | User is not related to verification body \t\n " +
        "AUTHORITY1007 | Active verifier admin should exist";
    public static final String DELETE_VERIFIER_AUTHORITY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "AUTHORITY1013 | User is not verifier \t\n " +
        "AUTHORITY1006 | User is not related to verification body \t\n " +
        "AUTHORITY1007 | Active verifier admin should exist";
    public static final String GET_VERIFIER_USER_BY_ID_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "AUTHORITY1013 | User is not verifier \t\n " +
        "AUTHORITY1006 | User is not related to verification body";
    public static final String UPDATE_VERIFIER_USER_BY_ID_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "AUTHORITY1013 | User is not verifier \t\n " +
        "AUTHORITY1006 | User is not related to verification body";
    public static final String REQUEST_TASK_CANDIDATE_ASSIGNEES_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "ITEM1001 | Request task is not assignable";
    public static final String REQUEST_TASK_TYPE_CANDIDATE_ASSIGNEES_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "ITEM1001 | Request task is not assignable";
    public static final String GET_DOCUMENT_TEMPLATE_BY_ID_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "NOTIF1001 | File does not exist for document template";
    public static final String UPDATE_DOCUMENT_TEMPLATE_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "NOTIF1001 | File does not exist for document template";
    public static final String REQUEST_TASK_CREATE_CARD_PAYMENT_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "REQUEST_TASK_ACTION1000 | Request task action cannot proceed \t\n " +
        "REQUEST_TASK_ACTION1001 | User is not the assignee of the request task \t\n " +
        "PAYMENT1002 | Payment method is not valid";
    public static final String REQUEST_TASK_PROCESS_EXISTING_CARD_PAYMENT_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "REQUEST_TASK_ACTION1000 | Request task action cannot proceed \t\n " +
        "REQUEST_TASK_ACTION1001 | User is not the assignee of the request task \t\n " +
        "PAYMENT1003 | Payment id does not exist";
    public static final String MI_REPORT_REQUEST_TYPE_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "MIREPORT1000 | Invalid MI Report type";
    public static final String GET_COMPANY_PROFILE_SERVICE_UNAVAILABLE = SERVICE_UNAVAILABLE + ERROR_CODES_HEADER +
        "COMPANYINFO1001 | Companies House API is currently unavailable \t\n " +
        "COMPANYINFO1002 | Companies House API authorization failed \t\n " +
        "COMPANYINFO1003 | Companies House API rate limiting reached";
    public static final String ONBOARDING_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
            "ONBOARDING1001 | Duplicate values exist in the provided list \t\n " +
            "ONBOARDING1002 | Values already exist";
}
