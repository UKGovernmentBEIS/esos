package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ActionPlanP3ApplicationRequestTaskPayload extends RequestTaskPayload {

    private ActionPlanP3 actionPlanP3;

    @Builder.Default
    private Map<String, String> actionPlanSectionsCompleted = new HashMap<>();

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    private Map<UUID, String> actionPlanAttachments = new HashMap<>();

    @Override
    public Map<UUID, String> getAttachments() {
        return getActionPlanAttachments();
    }

}
