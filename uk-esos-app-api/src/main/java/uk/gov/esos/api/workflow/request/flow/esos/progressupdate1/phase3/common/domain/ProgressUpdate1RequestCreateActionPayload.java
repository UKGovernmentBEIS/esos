package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.RequestCreateActionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ProgressUpdate1RequestCreateActionPayload extends RequestCreateActionPayload {

    @NotNull
    private Boolean isDisaggregateUndertaking;

}
