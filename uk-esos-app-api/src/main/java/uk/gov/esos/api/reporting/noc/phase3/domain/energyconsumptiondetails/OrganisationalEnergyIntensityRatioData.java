package uk.gov.esos.api.reporting.noc.phase3.domain.energyconsumptiondetails;

import jakarta.validation.Valid;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrganisationalEnergyIntensityRatioData {

    @Valid
    private EnergyIntensityRatioDetails buildings;

    @Valid
    private EnergyIntensityRatioDetails transport;

    @Valid
    private EnergyIntensityRatioDetails industrialProcesses;

    @Valid
    private EnergyIntensityRatioDetails otherProcesses;
}
