package uk.gov.esos.api.workflow.request.flow.rde.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RdeResponsePayload;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RdeSubmitRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RdeSubmittedRequestActionPayload;

import java.time.LocalDate;
import java.util.Map;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface RdeMapper {

    @Mapping(target = "payloadType", expression = "java(uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType.RDE_SUBMITTED_PAYLOAD)")
    RdeSubmittedRequestActionPayload toRdeSubmittedRequestActionPayload(
            RdeSubmitRequestTaskActionPayload taskActionPayload, Map<String, RequestActionUserInfo> usersInfo,
            FileInfoDTO officialDocument);

    RdeResponsePayload toRdeResponsePayload(LocalDate currentDueDate, LocalDate proposedDueDate);
}
