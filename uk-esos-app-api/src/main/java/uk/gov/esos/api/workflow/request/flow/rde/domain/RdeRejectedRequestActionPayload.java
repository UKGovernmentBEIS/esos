package uk.gov.esos.api.workflow.request.flow.rde.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.RequestActionPayload;

import jakarta.validation.constraints.NotBlank;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class RdeRejectedRequestActionPayload extends RequestActionPayload {

    private final RdeDecisionType decision = RdeDecisionType.REJECTED;
    
    @NotBlank
    private String reason;
}
