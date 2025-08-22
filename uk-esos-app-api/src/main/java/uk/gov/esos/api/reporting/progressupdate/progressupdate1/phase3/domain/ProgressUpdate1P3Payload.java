package uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.reporting.progressupdate.common.domain.GroupChange;
import uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressUpdate1P3Payload {

    @Valid
    private GroupChange groupChange;

    @Valid
    private ProgressUpdate1P3MeasuresUpdatePayload progressUpdate1P3MeasuresUpdate;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<ProgressUpdateP3Confirmation> responsibleOfficerConfirmation = new HashSet<>();
}
