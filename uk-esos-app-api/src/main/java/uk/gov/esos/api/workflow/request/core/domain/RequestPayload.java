package uk.gov.esos.api.workflow.request.core.domain;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3RequestPayload;

import java.math.BigDecimal;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME , include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "payloadType", visible = true)
@JsonSubTypes({
    @JsonSubTypes.Type(value = OrganisationAccountOpeningRequestPayload.class, name = "ORGANISATION_ACCOUNT_OPENING_REQUEST_PAYLOAD"),
    @JsonSubTypes.Type(value = NotificationOfComplianceP3RequestPayload.class, name = "NOTIFICATION_OF_COMPLIANCE_P3_REQUEST_PAYLOAD"),
    @JsonSubTypes.Type(value = ActionPlanP3RequestPayload.class, name = "ACTION_PLAN_P3_REQUEST_PAYLOAD"),
    @JsonSubTypes.Type(value = AccountClosureRequestPayload.class, name = "ACCOUNT_CLOSURE_REQUEST_PAYLOAD"),
    @JsonSubTypes.Type(value = ProgressUpdate1P3RequestPayload.class, name = "PROGRESS_UPDATE_1_P3_REQUEST_PAYLOAD"),
    @JsonSubTypes.Type(value = ProgressUpdate2P3RequestPayload.class, name = "PROGRESS_UPDATE_2_P3_REQUEST_PAYLOAD"),
})
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class RequestPayload implements Payload {

    private RequestPayloadType payloadType;

    private String operatorAssignee;

    private String regulatorAssignee;
    
    private String verifierAssignee;

    private String supportingOperator;

    private String supportingRegulator;

    private String regulatorReviewer;
    
    private Boolean paymentCompleted;
    
    private BigDecimal paymentAmount;
}
