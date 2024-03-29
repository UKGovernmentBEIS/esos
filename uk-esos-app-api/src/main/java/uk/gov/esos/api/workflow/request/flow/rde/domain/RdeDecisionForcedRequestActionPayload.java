package uk.gov.esos.api.workflow.request.flow.rde.domain;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.RequestActionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class RdeDecisionForcedRequestActionPayload extends RequestActionPayload {

    @NotNull
    @Valid
    private RdeForceDecisionPayload rdeForceDecisionPayload;

    @Builder.Default
    private Map<UUID, String> rdeAttachments = new HashMap<>();

    @Override
    public Map<UUID, String> getAttachments() {
        return this.rdeAttachments;
    }
}
