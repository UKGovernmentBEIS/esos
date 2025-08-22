package uk.gov.esos.api.reporting.noc.phase3.domain.energyconsumptiondetails;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnergyIntensityRatioDetails {

    @Valid
    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @NotEmpty
    private List<EnergyIntensityRatio> energyIntensityRatios = new ArrayList<>();

    @Size(max = 10000)
    private String additionalInformation;

}
