package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3;
import uk.gov.esos.api.workflow.request.core.domain.RequestPayload;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@SuperBuilder
public class ActionPlanP3RequestPayload extends RequestPayload {

    private ActionPlanP3 actionPlan;

    @Builder.Default
    private Map<String, String> actionPlanSectionsCompleted = new HashMap<>();

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    private Map<UUID, String> actionPlanAttachments = new HashMap<>();

}
