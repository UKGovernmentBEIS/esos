package uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressUpdate1P3UpdatedMeasurePayload {

    @NotNull
    private UUID uuId;

    @Valid
    @NotNull
    private ProgressUpdate1P3EnergyEfficiencyMeasure progressUpdate1P3EnergyEfficiencyMeasure;

}
