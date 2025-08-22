package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureRequestPayload;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface AccountClosureMapper {

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "submitDate", expression = "java(java.time.LocalDateTime.now())")
    AccountClosureApplicationRequestActionPayload toAccountClosureApplicationRequestActionPayload(
            AccountClosureRequestPayload requestPayload, RequestActionPayloadType payloadType);

}
