package uk.gov.esos.api.workflow.request.core.domain;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestMetadataType;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestMetadata;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestMetadata;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestMetadata;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3RequestMetadata;

@Schema(
        discriminatorMapping = {
                @DiscriminatorMapping(schema = NotificationOfComplianceP3RequestMetadata.class, value = "NOTIFICATION_OF_COMPLIANCE_P3"),
                @DiscriminatorMapping(schema = ActionPlanP3RequestMetadata.class, value = "ACTION_PLAN_P3"),
                @DiscriminatorMapping(schema = ProgressUpdate1P3RequestMetadata.class, value = "PROGRESS_UPDATE_1_P3"),
                @DiscriminatorMapping(schema = ProgressUpdate2P3RequestMetadata.class, value = "PROGRESS_UPDATE_2_P3"),
        },
        discriminatorProperty = "type")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME , include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type", visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = NotificationOfComplianceP3RequestMetadata.class, name = "NOTIFICATION_OF_COMPLIANCE_P3"),
        @JsonSubTypes.Type(value = ActionPlanP3RequestMetadata.class, name = "ACTION_PLAN_P3"),
        @JsonSubTypes.Type(value = ProgressUpdate1P3RequestMetadata.class, name = "PROGRESS_UPDATE_1_P3"),
        @JsonSubTypes.Type(value = ProgressUpdate2P3RequestMetadata.class, name = "PROGRESS_UPDATE_2_P3"),
})
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class RequestMetadata {

    private RequestMetadataType type;
}
