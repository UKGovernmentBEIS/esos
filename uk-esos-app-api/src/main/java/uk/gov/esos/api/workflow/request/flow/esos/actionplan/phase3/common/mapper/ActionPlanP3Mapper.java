package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestPayload;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface ActionPlanP3Mapper {

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "actionPlanAttachments", ignore = true)
    ActionPlanP3ApplicationRequestActionPayload toActionPlanP3ApplicationRequestActionPayload(
            ActionPlanP3RequestPayload requestPayload, RequestActionPayloadType payloadType);

    @AfterMapping
    default void setActionPlanAttachments(@MappingTarget ActionPlanP3ApplicationRequestActionPayload requestActionPayload,
                                          ActionPlanP3RequestPayload requestPayload) {
        requestActionPayload.setActionPlanAttachments(requestPayload.getActionPlanAttachments());
    }
}
