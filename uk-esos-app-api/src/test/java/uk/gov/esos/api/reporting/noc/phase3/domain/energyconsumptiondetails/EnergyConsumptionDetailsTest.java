package uk.gov.esos.api.reporting.noc.phase3.domain.energyconsumptiondetails;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.SignificantEnergyConsumption;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class EnergyConsumptionDetailsTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_valid() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50L)
            .transport(50L)
            .industrialProcesses(50L)
            .otherProcesses(50L)
            .total(200L)
            .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
            .buildings(45L)
            .transport(46L)
            .industrialProcesses(50L)
            .otherProcesses(50L)
            .total(191L)
            .significantEnergyConsumptionPct(95L)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData =
                buildFullOrganisationalEnergyIntensityRatioData();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(true)
            .significantEnergyConsumption(significantEnergyConsumption)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(true)
            .additionalInformation("info")
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_invalid_additional_information_should_not_exist() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50L)
            .transport(50L)
            .industrialProcesses(50L)
            .otherProcesses(50L)
            .total(200L)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData =
                buildFullOrganisationalEnergyIntensityRatioData();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(false)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .additionalInformation("information")
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.energyConsumptionDetails.additionalInformation.exist}");
    }


    @Test
    void validate_invalid_additional_information_should_exist() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50L)
            .transport(50L)
            .industrialProcesses(50L)
            .otherProcesses(50L)
            .total(200L)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData =
                buildFullOrganisationalEnergyIntensityRatioData();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(false)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(true)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.energyConsumptionDetails.additionalInformation.exist}");
    }

    @Test
    void validate_invalid_significant_energy_consumption_should_not_exist() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50L)
            .transport(50L)
            .industrialProcesses(50L)
            .otherProcesses(50L)
            .total(200L)
            .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
            .buildings(45L)
            .transport(45L)
            .industrialProcesses(50L)
            .otherProcesses(50L)
            .total(190L)
            .significantEnergyConsumptionPct(95L)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData =
                buildFullOrganisationalEnergyIntensityRatioData();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(false)
            .significantEnergyConsumption(significantEnergyConsumption)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.energyConsumptionDetails.significantEnergyConsumption.exist}");
    }

    @Test
    void validate_invalid_significant_energy_consumption_should_exist() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50L)
            .transport(50L)
            .industrialProcesses(50L)
            .otherProcesses(50L)
            .total(200L)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
                .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(true)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactlyInAnyOrder(
                "{noc.energyConsumptionDetails.significantEnergyConsumption.exist}",
                "{noc.energyConsumptionDetails.energyIntensityRatioData.buildings}",
                "{noc.energyConsumptionDetails.energyIntensityRatioData.transport}",
                "{noc.energyConsumptionDetails.energyIntensityRatioData.industrialProcesses}",
                "{noc.energyConsumptionDetails.energyIntensityRatioData.otherProcesses}"
        );
    }

    @Test
    void validate_invalid_significant_energy_consumption_pct_is_wrong() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50L)
            .transport(50L)
            .industrialProcesses(50L)
            .otherProcesses(50L)
            .total(200L)
            .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
            .buildings(45L)
            .transport(45L)
            .industrialProcesses(50L)
            .otherProcesses(50L)
            .total(190L)
            .significantEnergyConsumptionPct(98L)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData =
                buildFullOrganisationalEnergyIntensityRatioData();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(true)
            .significantEnergyConsumption(significantEnergyConsumption)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.energyConsumptionDetails.significantEnergyConsumptionPct}");
    }

    @Test
    void validate_invalid_significant_energy_consumption_values_bigger_than_energy_consumption() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50L)
            .transport(50L)
            .industrialProcesses(50L)
            .otherProcesses(50L)
            .total(200L)
            .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
            .buildings(60L)
            .transport(60L)
            .industrialProcesses(60L)
            .otherProcesses(10L)
            .total(190L)
            .significantEnergyConsumptionPct(95L)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData =
                buildFullOrganisationalEnergyIntensityRatioData();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(true)
            .significantEnergyConsumption(significantEnergyConsumption)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactlyInAnyOrder(
            "{noc.energyConsumptionDetails.buildings}",
            "{noc.energyConsumptionDetails.transport}",
            "{noc.energyConsumptionDetails.industrialProcesses}");
    }

    @Test
    void validate_invalid_when_consumption_total_not_bigger_than_zero() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(0L)
            .transport(0L)
            .industrialProcesses(0L)
            .otherProcesses(0L)
            .total(0L)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
                .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(false)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactlyInAnyOrder(
            "{noc.energyConsumptionDetails.totalEnergyConsumption.total}");
    }

    @Test
    void validate_invalid_when_significant_consumption_total_not_bigger_than_zero() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
            .buildings(50L)
            .transport(50L)
            .industrialProcesses(50L)
            .otherProcesses(50L)
            .total(200L)
            .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
            .buildings(0L)
            .transport(0L)
            .industrialProcesses(0L)
            .otherProcesses(0L)
            .total(0L)
            .significantEnergyConsumptionPct(100L)
            .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
                .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
            .totalEnergyConsumption(totalEnergyConsumption)
            .significantEnergyConsumptionExists(true)
            .significantEnergyConsumption(significantEnergyConsumption)
            .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
            .additionalInformationExists(false)
            .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactlyInAnyOrder(
            "{noc.energyConsumptionDetails.significantEnergyConsumption.total}",
            "{noc.energyConsumptionDetails.significantEnergyConsumptionPct}");
    }

    @Test
    void validate_missing_ratio_data_for_total() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
                .buildings(50L)
                .transport(50L)
                .industrialProcesses(50L)
                .otherProcesses(50L)
                .total(200L)
                .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
                .transport(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(10.23)).unit("kwh").build()))
                        .build())
                .industrialProcesses(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(15.67)).unit("kwh").build()))
                        .build())
                .otherProcesses(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(17.10)).unit("kwh").build()))
                        .build())
                .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
                .totalEnergyConsumption(totalEnergyConsumption)
                .significantEnergyConsumptionExists(false)
                .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
                .additionalInformationExists(true)
                .additionalInformation("info")
                .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
                "{noc.energyConsumptionDetails.energyIntensityRatioData.buildings}");
    }

    @Test
    void validate_missing_ratio_data_for_significant() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
                .buildings(50L)
                .transport(50L)
                .industrialProcesses(50L)
                .otherProcesses(50L)
                .total(200L)
                .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
                .buildings(45L)
                .transport(46L)
                .industrialProcesses(50L)
                .otherProcesses(50L)
                .total(191L)
                .significantEnergyConsumptionPct(95L)
                .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
                .buildings(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(10.23)).unit("kwh").build()))
                        .build())
                .industrialProcesses(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(13.18)).unit("kwh").build()))
                        .build())
                .otherProcesses(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(19.56)).unit("kwh").build()))
                        .build())
                .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
                .totalEnergyConsumption(totalEnergyConsumption)
                .significantEnergyConsumptionExists(true)
                .significantEnergyConsumption(significantEnergyConsumption)
                .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
                .additionalInformationExists(true)
                .additionalInformation("info")
                .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
                "{noc.energyConsumptionDetails.energyIntensityRatioData.transport}");
    }

    @Test
    void validate_extra_ratio_data_for_total() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
                .buildings(95L)
                .transport(0L)
                .industrialProcesses(0L)
                .otherProcesses(0L)
                .total(95L)
                .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
                .buildings(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(11.33)).unit("kwh").build()))
                        .build())
                .otherProcesses(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(12.48)).unit("kwh").build()))
                        .build())
                .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
                .totalEnergyConsumption(totalEnergyConsumption)
                .significantEnergyConsumptionExists(false)
                .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
                .additionalInformationExists(true)
                .additionalInformation("info")
                .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
                "{noc.energyConsumptionDetails.energyIntensityRatioData.otherProcesses}");
    }

    @Test
    void validate_extra_ratio_data_for_significant() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
                .buildings(95L)
                .transport(0L)
                .industrialProcesses(5L)
                .otherProcesses(0L)
                .total(100L)
                .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
                .buildings(95L)
                .transport(0L)
                .industrialProcesses(0L)
                .otherProcesses(0L)
                .total(95L)
                .significantEnergyConsumptionPct(95L)
                .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData = OrganisationalEnergyIntensityRatioData.builder()
                .buildings(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(18.25)).unit("kwh").build()))
                        .build())
                .industrialProcesses(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(16.89)).unit("kwh").build()))
                        .build())
                .build();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
                .totalEnergyConsumption(totalEnergyConsumption)
                .significantEnergyConsumptionExists(true)
                .significantEnergyConsumption(significantEnergyConsumption)
                .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
                .additionalInformationExists(true)
                .additionalInformation("info")
                .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
                "{noc.energyConsumptionDetails.energyIntensityRatioData.industrialProcesses}");
    }

    @Test
    void validate_total_energy_consumption_null_values_valid() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
                .buildings(50L)
                .transport(50L)
                .total(100L)
                .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
                .buildings(45L)
                .transport(46L)
                .industrialProcesses(50L)
                .otherProcesses(50L)
                .total(191L)
                .significantEnergyConsumptionPct(95L)
                .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData =
                buildFullOrganisationalEnergyIntensityRatioData();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
                .totalEnergyConsumption(totalEnergyConsumption)
                .significantEnergyConsumptionExists(true)
                .significantEnergyConsumption(significantEnergyConsumption)
                .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
                .additionalInformationExists(true)
                .additionalInformation("info")
                .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).contains(
                "{noc.energyConsumptionDetails.totalEnergyConsumption.exist}");
    }

    @Test
    void validate_missing_total_energy_consumption_fields_invalid() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
                .buildings(50L)
                .industrialProcesses(50L)
                .total(100L)
                .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
                .buildings(45L)
                .transport(46L)
                .industrialProcesses(50L)
                .otherProcesses(50L)
                .total(191L)
                .significantEnergyConsumptionPct(95L)
                .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData =
                buildFullOrganisationalEnergyIntensityRatioData();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
                .totalEnergyConsumption(totalEnergyConsumption)
                .significantEnergyConsumptionExists(true)
                .significantEnergyConsumption(significantEnergyConsumption)
                .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
                .additionalInformationExists(true)
                .additionalInformation("info")
                .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).contains(
                "{noc.energyConsumptionDetails.totalEnergyConsumption.exist}");
    }

    @Test
    void validate_missing_significant_energy_consumption_fields_invalid() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
                .buildings(50L)
                .transport(50L)
                .industrialProcesses(50L)
                .otherProcesses(50L)
                .total(200L)
                .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
                .industrialProcesses(50L)
                .otherProcesses(50L)
                .total(100L)
                .significantEnergyConsumptionPct(200L)
                .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData =
                buildFullOrganisationalEnergyIntensityRatioData();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
                .totalEnergyConsumption(totalEnergyConsumption)
                .significantEnergyConsumptionExists(true)
                .significantEnergyConsumption(significantEnergyConsumption)
                .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
                .additionalInformationExists(true)
                .additionalInformation("info")
                .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).contains(
                "{noc.energyConsumptionDetails.significantEnergyConsumption}",
                "{noc.energyConsumptionDetails.significantEnergyConsumptionPct.range}");
    }

    @Test
    void validate_significant_energy_consumption_percentage_out_of_range_invalid() {
        EnergyConsumption totalEnergyConsumption = EnergyConsumption.builder()
                .buildings(50L)
                .transport(50L)
                .industrialProcesses(50L)
                .otherProcesses(50L)
                .total(200L)
                .build();

        SignificantEnergyConsumption significantEnergyConsumption = SignificantEnergyConsumption.builder()
                .buildings(40L)
                .transport(40L)
                .industrialProcesses(50L)
                .otherProcesses(50L)
                .total(180L)
                .significantEnergyConsumptionPct(90L)
                .build();

        OrganisationalEnergyIntensityRatioData organisationalEnergyIntensityRatioData =
                buildFullOrganisationalEnergyIntensityRatioData();

        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder()
                .totalEnergyConsumption(totalEnergyConsumption)
                .significantEnergyConsumptionExists(true)
                .significantEnergyConsumption(significantEnergyConsumption)
                .energyIntensityRatioData(organisationalEnergyIntensityRatioData)
                .additionalInformationExists(true)
                .additionalInformation("info")
                .build();

        Set<ConstraintViolation<EnergyConsumptionDetails>> violations = validator.validate(energyConsumptionDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).contains(
                "{noc.energyConsumptionDetails.significantEnergyConsumptionPct.range}");
    }

    private OrganisationalEnergyIntensityRatioData buildFullOrganisationalEnergyIntensityRatioData() {
        return OrganisationalEnergyIntensityRatioData.builder()
                .buildings(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(14.234)).unit("kwh").build()))
                        .build())
                .transport(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(17.4989)).unit("kwh").build()))
                        .build())
                .industrialProcesses(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(10.67892)).unit("kwh").build()))
                        .build())
                .otherProcesses(EnergyIntensityRatioDetails.builder()
                        .energyIntensityRatios(List.of(EnergyIntensityRatio.builder().ratio(BigDecimal.valueOf(10.123456)).unit("kwh").build()))
                        .build())
                .build();
    }
}