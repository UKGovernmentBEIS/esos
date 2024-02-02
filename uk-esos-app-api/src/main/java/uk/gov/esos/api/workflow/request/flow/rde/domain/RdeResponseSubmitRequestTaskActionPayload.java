package uk.gov.esos.api.workflow.request.flow.rde.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskActionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class RdeResponseSubmitRequestTaskActionPayload extends RequestTaskActionPayload {

    @NotNull
    @Valid
    private RdeDecisionPayload rdeDecisionPayload;
}
