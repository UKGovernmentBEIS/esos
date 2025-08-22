package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain;

import lombok.*;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskActionPayload;

import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ActionPlanP3SaveApplicationRequestTaskActionPayload extends RequestTaskActionPayload {

    private ActionPlanP3 actionPlanP3;

    @Builder.Default
    private Map<String, String> actionPlanSectionsCompleted = new HashMap<>();
}
