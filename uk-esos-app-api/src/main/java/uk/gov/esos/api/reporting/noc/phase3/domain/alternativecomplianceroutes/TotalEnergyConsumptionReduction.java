package uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.reporting.noc.phase3.domain.PotentialReductionPair;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TotalEnergyConsumptionReduction {

    @Valid
    @JsonUnwrapped
    private PotentialReductionPair potentialReductionPair;
}
