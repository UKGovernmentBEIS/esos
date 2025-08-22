package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3ApplicationRequestTaskPayload;

@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class ActionPlanP3ApplicationSubmitRequestTaskPayload extends ActionPlanP3ApplicationRequestTaskPayload {
}
