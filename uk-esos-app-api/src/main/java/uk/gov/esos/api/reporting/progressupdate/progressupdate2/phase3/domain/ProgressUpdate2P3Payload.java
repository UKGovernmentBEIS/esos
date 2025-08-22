package uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain;

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
public class ProgressUpdate2P3Payload {

    @Valid
    private GroupChange groupChange;

    @Valid
    private ProgressUpdate2P3MeasuresUpdatePayload progressUpdate2P3MeasuresUpdate;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<ProgressUpdateP3Confirmation> responsibleOfficerConfirmation = new HashSet<>();
}
