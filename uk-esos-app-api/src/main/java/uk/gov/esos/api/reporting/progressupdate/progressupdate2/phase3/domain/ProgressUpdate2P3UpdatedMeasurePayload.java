package uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain;

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
public class ProgressUpdate2P3UpdatedMeasurePayload {

    @NotNull
    private UUID uuId;

    @Valid
    private ProgressUpdate2P3EnergyEfficiencyMeasure progressUpdate2P3EnergyEfficiencyMeasure;
}
