package uk.gov.esos.api.workflow.request.flow.rde.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RdeForceDecisionPayload {

    @NotNull
    private RdeDecisionType decision;

    @NotNull
    @Size(max = 10000)
    private String evidence;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<UUID> files = new HashSet<>();
}
