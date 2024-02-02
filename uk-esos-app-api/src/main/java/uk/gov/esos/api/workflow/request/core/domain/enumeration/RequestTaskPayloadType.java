package uk.gov.esos.api.workflow.request.core.domain.enumeration;

public enum RequestTaskPayloadType {
    ORGANISATION_ACCOUNT_OPENING_APPLICATION_PAYLOAD,

    NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT_PAYLOAD,
    NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT_PAYLOAD,
    
    RFI_RESPONSE_SUBMIT_PAYLOAD,
    
    RDE_RESPONSE_SUBMIT_PAYLOAD,
    RDE_WAIT_FOR_RESPONSE_PAYLOAD,

    PAYMENT_MAKE_PAYLOAD,
    PAYMENT_TRACK_PAYLOAD,
    PAYMENT_CONFIRM_PAYLOAD
}
