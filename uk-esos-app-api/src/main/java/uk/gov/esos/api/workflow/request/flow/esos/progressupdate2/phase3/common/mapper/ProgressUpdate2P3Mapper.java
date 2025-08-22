package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3RequestPayload;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface ProgressUpdate2P3Mapper {

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "progressUpdate2Attachments", ignore = true)
    ProgressUpdate2P3ApplicationRequestActionPayload toProgressUpdate2P3ApplicationRequestActionPayload(
            ProgressUpdate2P3RequestPayload requestPayload, RequestActionPayloadType payloadType);

    @AfterMapping
    default void setProgressUpdate2Attachments(@MappingTarget ProgressUpdate2P3ApplicationRequestActionPayload requestActionPayload,
                                               ProgressUpdate2P3RequestPayload requestPayload) {
        requestActionPayload.setProgressUpdate2Attachments(requestPayload.getProgressUpdate2Attachments());
    }
}
