package uk.gov.esos.api.workflow.request.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.util.CollectionUtils;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.domain.ActionPlanP3ApplicationSubmitRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.edit.domain.NotificationOfComplianceP3ApplicationEditRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.domain.NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.domain.ProgressUpdate1P3ApplicationSubmitRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.domain.ProgressUpdate2P3ApplicationSubmitRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.payment.domain.PaymentConfirmRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.payment.domain.PaymentMakeRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.payment.domain.PaymentTrackRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RdeForceDecisionRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RdeResponseRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.rfi.domain.RfiResponseSubmitRequestTaskPayload;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Schema(
        discriminatorMapping = {
                @DiscriminatorMapping(schema = OrganisationAccountOpeningApplicationRequestTaskPayload.class, value = "ORGANISATION_ACCOUNT_OPENING_APPLICATION_PAYLOAD"),

                @DiscriminatorMapping(schema = NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload.class, value = "NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT_PAYLOAD"),
                @DiscriminatorMapping(schema = NotificationOfComplianceP3ApplicationEditRequestTaskPayload.class, value = "NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT_PAYLOAD"),

                @DiscriminatorMapping(schema = RfiResponseSubmitRequestTaskPayload.class, value = "RFI_RESPONSE_SUBMIT_PAYLOAD"),

                @DiscriminatorMapping(schema = RdeForceDecisionRequestTaskPayload.class, value = "RDE_WAIT_FOR_RESPONSE_PAYLOAD"),
                @DiscriminatorMapping(schema = RdeResponseRequestTaskPayload.class, value = "RDE_RESPONSE_SUBMIT_PAYLOAD"),

                @DiscriminatorMapping(schema = PaymentMakeRequestTaskPayload.class, value = "PAYMENT_MAKE_PAYLOAD"),
                @DiscriminatorMapping(schema = PaymentTrackRequestTaskPayload.class, value = "PAYMENT_TRACK_PAYLOAD"),
                @DiscriminatorMapping(schema = PaymentConfirmRequestTaskPayload.class, value = "PAYMENT_CONFIRM_PAYLOAD"),

                @DiscriminatorMapping(schema = ActionPlanP3ApplicationSubmitRequestTaskPayload.class, value = "ACTION_PLAN_P3_APPLICATION_SUBMIT_PAYLOAD"),

                @DiscriminatorMapping(schema = AccountClosureApplicationRequestTaskPayload.class, value = "ACCOUNT_CLOSURE_APPLICATION_SUBMIT_PAYLOAD"),

                @DiscriminatorMapping(schema = ProgressUpdate1P3ApplicationSubmitRequestTaskPayload.class, value = "PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT_PAYLOAD"),
                @DiscriminatorMapping(schema = ProgressUpdate2P3ApplicationSubmitRequestTaskPayload.class, value = "PROGRESS_UPDATE_2_P3_APPLICATION_SUBMIT_PAYLOAD")

        },
        discriminatorProperty = "payloadType"
)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "payloadType", visible = true)
@JsonSubTypes({
    @JsonSubTypes.Type(value = OrganisationAccountOpeningApplicationRequestTaskPayload.class, name = "ORGANISATION_ACCOUNT_OPENING_APPLICATION_PAYLOAD"),

    @JsonSubTypes.Type(value = NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload.class, name = "NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT_PAYLOAD"),
    @JsonSubTypes.Type(value = NotificationOfComplianceP3ApplicationEditRequestTaskPayload.class, name = "NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT_PAYLOAD"),

    @JsonSubTypes.Type(value = RfiResponseSubmitRequestTaskPayload.class, name = "RFI_RESPONSE_SUBMIT_PAYLOAD"),

    @JsonSubTypes.Type(value = RdeForceDecisionRequestTaskPayload.class, name = "RDE_WAIT_FOR_RESPONSE_PAYLOAD"),
    @JsonSubTypes.Type(value = RdeResponseRequestTaskPayload.class, name = "RDE_RESPONSE_SUBMIT_PAYLOAD"),

    @JsonSubTypes.Type(value = PaymentMakeRequestTaskPayload.class, name = "PAYMENT_MAKE_PAYLOAD"),
    @JsonSubTypes.Type(value = PaymentTrackRequestTaskPayload.class, name = "PAYMENT_TRACK_PAYLOAD"),
    @JsonSubTypes.Type(value = PaymentConfirmRequestTaskPayload.class, name = "PAYMENT_CONFIRM_PAYLOAD"),

    @JsonSubTypes.Type(value = ActionPlanP3ApplicationSubmitRequestTaskPayload.class, name = "ACTION_PLAN_P3_APPLICATION_SUBMIT_PAYLOAD"),

    @JsonSubTypes.Type(value = AccountClosureApplicationRequestTaskPayload.class, name = "ACCOUNT_CLOSURE_APPLICATION_SUBMIT_PAYLOAD"),

    @JsonSubTypes.Type(value = ProgressUpdate1P3ApplicationSubmitRequestTaskPayload.class, name = "PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT_PAYLOAD"),
    @JsonSubTypes.Type(value = ProgressUpdate2P3ApplicationSubmitRequestTaskPayload.class, name = "PROGRESS_UPDATE_2_P3_APPLICATION_SUBMIT_PAYLOAD"),

})
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class RequestTaskPayload {

    private RequestTaskPayloadType payloadType;

    @JsonIgnore
    public Map<UUID, String> getAttachments() {
        return Collections.emptyMap();
    }

    @JsonIgnore
    public Set<UUID> getReferencedAttachmentIds() {
        return Collections.emptySet();
    }

    @JsonIgnore
    public void removeAttachments(final Collection<UUID> uuids) {

        if (CollectionUtils.isEmpty(uuids)) {
            return;
        }
        this.getAttachments().keySet().removeIf(uuids::contains);
    }
}
