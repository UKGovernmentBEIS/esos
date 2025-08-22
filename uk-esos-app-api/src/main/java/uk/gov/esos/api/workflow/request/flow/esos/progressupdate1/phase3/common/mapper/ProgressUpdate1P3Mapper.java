package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestPayload;


@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface ProgressUpdate1P3Mapper {

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "progressUpdate1Attachments", ignore = true)
    ProgressUpdate1P3ApplicationRequestActionPayload toProgressUpdate1P3ApplicationRequestActionPayload(
            ProgressUpdate1P3RequestPayload requestPayload, RequestActionPayloadType payloadType);

    @AfterMapping
    default void setProgressUpdate1Attachments(@MappingTarget ProgressUpdate1P3ApplicationRequestActionPayload requestActionPayload,
                                               ProgressUpdate1P3RequestPayload requestPayload) {
        requestActionPayload.setProgressUpdate1Attachments(requestPayload.getProgressUpdate1Attachments());
    }
}
