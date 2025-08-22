package uk.gov.esos.api.reporting.noc.phase3.domain.energyconsumptiondetails;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;
import uk.gov.esos.api.reporting.noc.phase3.domain.SignificantEnergyConsumption;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#significantEnergyConsumptionExists) == (#significantEnergyConsumption != null)}",
    message = "noc.energyConsumptionDetails.significantEnergyConsumption.exist")
@SpELExpression(expression = "{(#totalEnergyConsumption?.total == null || #significantEnergyConsumption?.total == null || #significantEnergyConsumption?.significantEnergyConsumptionPct == null) " +
    "|| (T(java.lang.Math).floor(#significantEnergyConsumption.total * 100.0 / #totalEnergyConsumption.total) == #significantEnergyConsumption.significantEnergyConsumptionPct)} ",
    message = "noc.energyConsumptionDetails.significantEnergyConsumptionPct")
@SpELExpression(expression = "{(#significantEnergyConsumption?.significantEnergyConsumptionPct == null) " +
        "|| ((#significantEnergyConsumption?.significantEnergyConsumptionPct >= 95) && (#significantEnergyConsumption?.significantEnergyConsumptionPct <= 100))} ",
        message = "noc.energyConsumptionDetails.significantEnergyConsumptionPct.range")
@SpELExpression(expression = "{(#totalEnergyConsumption?.total == null || #totalEnergyConsumption.total > 0)} ",
    message = "noc.energyConsumptionDetails.totalEnergyConsumption.total")
@SpELExpression(expression = "{(#significantEnergyConsumption?.total == null || #significantEnergyConsumption.total > 0)} ",
    message = "noc.energyConsumptionDetails.significantEnergyConsumption.total")

@SpELExpression(expression = "{(#totalEnergyConsumption?.buildings == null || #significantEnergyConsumption?.buildings == null) " +
    "|| (#significantEnergyConsumption.buildings.compareTo(#totalEnergyConsumption.buildings) <= 0)} ", message = "noc.energyConsumptionDetails.buildings")
@SpELExpression(expression = "{(#totalEnergyConsumption?.transport == null || #significantEnergyConsumption?.transport == null) " +
    "|| (#significantEnergyConsumption.transport.compareTo(#totalEnergyConsumption.transport) <= 0)} ", message = "noc.energyConsumptionDetails.transport")
@SpELExpression(expression = "{(#totalEnergyConsumption?.industrialProcesses == null || #significantEnergyConsumption?.industrialProcesses == null) " +
    "|| (#significantEnergyConsumption.industrialProcesses.compareTo(#totalEnergyConsumption.industrialProcesses) <= 0)} ", message = "noc.energyConsumptionDetails.industrialProcesses")
@SpELExpression(expression = "{(#totalEnergyConsumption?.otherProcesses == null || #significantEnergyConsumption?.otherProcesses == null) " +
    "|| (#significantEnergyConsumption.otherProcesses.compareTo(#totalEnergyConsumption.otherProcesses) <= 0)} ", message = "noc.energyConsumptionDetails.otherProcesses")

@SpELExpression(expression = "{(#totalEnergyConsumption?.buildings != null && #totalEnergyConsumption?.transport != null " +
        "&& #totalEnergyConsumption?.industrialProcesses != null &&  #totalEnergyConsumption?.otherProcesses != null)} ",
        message = "noc.energyConsumptionDetails.totalEnergyConsumption.exist")
@SpELExpression(expression = "{(#significantEnergyConsumption != null) == (#significantEnergyConsumption?.buildings != null && #significantEnergyConsumption?.transport != null " +
        "&& #significantEnergyConsumption?.industrialProcesses != null &&  #significantEnergyConsumption?.otherProcesses != null)} ",
        message = "noc.energyConsumptionDetails.significantEnergyConsumption")

@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#additionalInformationExists) == (#additionalInformation != null)}",
    message = "noc.energyConsumptionDetails.additionalInformation.exist")

@SpELExpression(expression = "{" +
        "T(java.lang.Boolean).TRUE.equals(#significantEnergyConsumptionExists) " +
        "? (#significantEnergyConsumption?.buildings == 0 && #energyIntensityRatioData?.buildings == null) || " +
        "(#significantEnergyConsumption?.buildings > 0 && #energyIntensityRatioData?.buildings != null) " +
        ": (#totalEnergyConsumption?.buildings == 0 && #energyIntensityRatioData?.buildings == null) || " +
        "(#totalEnergyConsumption?.buildings > 0 && #energyIntensityRatioData?.buildings != null)" +
        "}",
        message = "noc.energyConsumptionDetails.energyIntensityRatioData.buildings")
@SpELExpression(expression = "{" +
        "T(java.lang.Boolean).TRUE.equals(#significantEnergyConsumptionExists) " +
        "? (#significantEnergyConsumption?.transport == 0 && #energyIntensityRatioData?.transport == null) || " +
        "(#significantEnergyConsumption?.transport > 0 && #energyIntensityRatioData?.transport != null) " +
        ": (#totalEnergyConsumption?.transport == 0 && #energyIntensityRatioData?.transport == null) || " +
        "(#totalEnergyConsumption?.transport > 0 && #energyIntensityRatioData?.transport != null)" +
        "}",
        message = "noc.energyConsumptionDetails.energyIntensityRatioData.transport")
@SpELExpression(expression = "{" +
        "T(java.lang.Boolean).TRUE.equals(#significantEnergyConsumptionExists) " +
        "? (#significantEnergyConsumption?.industrialProcesses == 0 && #energyIntensityRatioData?.industrialProcesses == null) || " +
        "(#significantEnergyConsumption?.industrialProcesses > 0 && #energyIntensityRatioData?.industrialProcesses != null) " +
        ": (#totalEnergyConsumption?.industrialProcesses == 0 && #energyIntensityRatioData?.industrialProcesses == null) || " +
        "(#totalEnergyConsumption?.industrialProcesses > 0 && #energyIntensityRatioData?.industrialProcesses != null)" +
        "}",
        message = "noc.energyConsumptionDetails.energyIntensityRatioData.industrialProcesses")
@SpELExpression(expression = "{" +
        "T(java.lang.Boolean).TRUE.equals(#significantEnergyConsumptionExists) " +
        "? (#significantEnergyConsumption?.otherProcesses == 0 && #energyIntensityRatioData?.otherProcesses == null) || " +
        "(#significantEnergyConsumption?.otherProcesses > 0 && #energyIntensityRatioData?.otherProcesses != null) " +
        ": (#totalEnergyConsumption?.otherProcesses == 0 && #energyIntensityRatioData?.otherProcesses == null) || " +
        "(#totalEnergyConsumption?.otherProcesses > 0 && #energyIntensityRatioData?.otherProcesses != null)" +
        "}",
        message = "noc.energyConsumptionDetails.energyIntensityRatioData.otherProcesses")
public class EnergyConsumptionDetails implements NocP3Section {

    @NotNull
    @Valid
    private EnergyConsumption totalEnergyConsumption;

    @NotNull
    private Boolean significantEnergyConsumptionExists;

    @Valid
    private SignificantEnergyConsumption significantEnergyConsumption;

    @Valid
    @NotNull
    private OrganisationalEnergyIntensityRatioData energyIntensityRatioData;

    @NotNull
    private Boolean additionalInformationExists;

    @Size(max = 10000)
    private String additionalInformation;
}
