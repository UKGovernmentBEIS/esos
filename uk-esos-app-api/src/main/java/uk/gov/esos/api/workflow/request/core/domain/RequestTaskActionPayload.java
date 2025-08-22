package uk.gov.esos.api.workflow.request.core.domain;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureSaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningSubmitDecisionRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3SaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.common.domain.SendToEditRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3SaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3SaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.payment.domain.PaymentCancelRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.payment.domain.PaymentMarkAsReceivedRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RdeForceDecisionRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RdeResponseSubmitRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RdeSubmitRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.rfi.domain.RfiResponseSubmitRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.rfi.domain.RfiSubmitRequestTaskActionPayload;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME , include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "payloadType", visible = true)
@JsonSubTypes({
    @JsonSubTypes.Type(value = OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload.class, name = "ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION_PAYLOAD"),
    @JsonSubTypes.Type(value = OrganisationAccountOpeningSubmitDecisionRequestTaskActionPayload.class, name = "ORGANISATION_ACCOUNT_OPENING_SUBMIT_DECISION_PAYLOAD"),

    @JsonSubTypes.Type(value = NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload.class, name = "NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD"),
    @JsonSubTypes.Type(value = SendToEditRequestTaskActionPayload.class, name = "NOTIFICATION_OF_COMPLIANCE_P3_SEND_TO_EDIT_PAYLOAD"),
    @JsonSubTypes.Type(value = NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload.class, name = "NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_EDIT_PAYLOAD"),

    @JsonSubTypes.Type(value = RfiSubmitRequestTaskActionPayload.class, name = "RFI_SUBMIT_PAYLOAD"),
    @JsonSubTypes.Type(value = RfiResponseSubmitRequestTaskActionPayload.class, name = "RFI_RESPONSE_SUBMIT_PAYLOAD"),

    @JsonSubTypes.Type(value = RdeSubmitRequestTaskActionPayload.class, name = "RDE_SUBMIT_PAYLOAD"),
    @JsonSubTypes.Type(value = RdeForceDecisionRequestTaskActionPayload.class, name = "RDE_FORCE_DECISION_PAYLOAD"),
    @JsonSubTypes.Type(value = RdeResponseSubmitRequestTaskActionPayload.class, name = "RDE_RESPONSE_SUBMIT_PAYLOAD"),
    
    @JsonSubTypes.Type(value = PaymentMarkAsReceivedRequestTaskActionPayload.class, name = "PAYMENT_MARK_AS_RECEIVED_PAYLOAD"),
    @JsonSubTypes.Type(value = PaymentCancelRequestTaskActionPayload.class, name = "PAYMENT_CANCEL_PAYLOAD"),

    @JsonSubTypes.Type(value = ActionPlanP3SaveApplicationRequestTaskActionPayload.class, name = "ACTION_PLAN_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD"),

    @JsonSubTypes.Type(value = AccountClosureSaveApplicationRequestTaskActionPayload.class, name = "ACCOUNT_CLOSURE_SAVE_APPLICATION_SUBMIT_PAYLOAD"),

    @JsonSubTypes.Type(value = ProgressUpdate1P3SaveApplicationRequestTaskActionPayload.class, name = "PROGRESS_UPDATE_1_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD"),

    @JsonSubTypes.Type(value = ProgressUpdate2P3SaveApplicationRequestTaskActionPayload.class, name = "PROGRESS_UPDATE_2_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD"),

    @JsonSubTypes.Type(value = RequestTaskActionEmptyPayload.class, name = "EMPTY_PAYLOAD"),

})
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class RequestTaskActionPayload {

    private RequestTaskActionPayloadType payloadType;
}
