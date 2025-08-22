package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.transform;

import org.mapstruct.Mapper;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3Container;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestPayload;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface ActionPlanP3SubmitMapper {

    ActionPlanP3Container toActionPlanP3Container(ActionPlanP3RequestPayload requestPayload, Phase phase);

}