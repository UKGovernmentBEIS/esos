package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved.EnergySavingsCategories;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved.EnergySavingsAchieved;
import uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved.EnergySavingsRecommendations;
import uk.gov.esos.api.reporting.noc.phase3.domain.OptionalQuestion;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3EnergySavingsAchievedContextValidatorServiceTest {

    @InjectMocks
    private NocP3EnergySavingsAchievedContextValidatorService contextValidator;

    @Mock
    private NocSectionConstraintValidatorService<EnergySavingsAchieved> nocSectionConstraintValidatorService;

    @Test
    void validate_ESOS_ENERGY_ASSESSMENTS_95_TO_100_categories_exist_valid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsEstimation(EnergyConsumption.builder()
                .buildings(30L)
                .transport(20L)
                .industrialProcesses(100L)
                .otherProcesses(100L)
                .total(250L)
                .build())
            .energySavingCategoriesExist(OptionalQuestion.YES)
            .energySavingsCategories(EnergySavingsCategories.builder()
                .energyManagementPractices(10L)
                .behaviourChangeInterventions(20L)
                .training(30L)
                .controlsImprovements(40L)
                .capitalInvestments(50L)
                .otherMeasures(20L)
                .total(200L)
                .build())
            .energySavingsRecommendationsExist(OptionalQuestion.YES)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(50)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(130)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_PARTIAL_ENERGY_ASSESSMENTS_categories_not_exist_valid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsEstimation(EnergyConsumption.builder()
                .buildings(30L)
                .transport(20L)
                .industrialProcesses(100L)
                .otherProcesses(50L)
                .total(200L)
                .build())
            .energySavingCategoriesExist(OptionalQuestion.NO)
            .energySavingsRecommendationsExist(OptionalQuestion.YES)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_valid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .totalEnergySavingsEstimation(150L)
            .energySavingsRecommendationsExist(OptionalQuestion.YES)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_LESS_THAN_40000_KWH_PER_YEAR_estimation_categories_not_exist_invalid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsRecommendationsExist(OptionalQuestion.YES)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CONSUMPTION.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CATEGORIES.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100_total_estimation_exist_invalid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsEstimation(EnergyConsumption.builder()
                .buildings(30L)
                .transport(20L)
                .industrialProcesses(100L)
                .otherProcesses(50L)
                .total(200L)
                .build())
            .energySavingCategoriesExist(OptionalQuestion.YES)
            .energySavingsCategories(EnergySavingsCategories.builder()
                .energyManagementPractices(10L)
                .behaviourChangeInterventions(20L)
                .training(30L)
                .controlsImprovements(40L)
                .capitalInvestments(50L)
                .otherMeasures(20L)
                .total(200L)
                .build())
            .totalEnergySavingsEstimation(150L)
            .energySavingsRecommendationsExist(OptionalQuestion.YES)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_TOTAL_ENERGY_SAVINGS_ESTIMATION.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100_estimation_exist_valid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsEstimation(EnergyConsumption.builder()
                .buildings(30L)
                .transport(20L)
                .industrialProcesses(100L)
                .otherProcesses(50L)
                .total(200L)
                .build())
            .energySavingCategoriesExist(OptionalQuestion.NO)
            .energySavingsRecommendationsExist(OptionalQuestion.YES)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_estimation_categories_exist_invalid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsEstimation(EnergyConsumption.builder()
                .buildings(30L)
                .transport(20L)
                .industrialProcesses(100L)
                .otherProcesses(50L)
                .total(200L)
                .build())
            .energySavingCategoriesExist(OptionalQuestion.YES)
            .energySavingsCategories(EnergySavingsCategories.builder()
                .energyManagementPractices(10L)
                .behaviourChangeInterventions(20L)
                .training(30L)
                .controlsImprovements(40L)
                .capitalInvestments(50L)
                .otherMeasures(30L)
                .total(220L)
                .build())
            .totalEnergySavingsEstimation(150L)
            .energySavingsRecommendationsExist(OptionalQuestion.YES)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CONSUMPTION.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CATEGORIES.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_PARTIAL_ENERGY_ASSESSMENTS_categories_exist_invalid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsEstimation(EnergyConsumption.builder()
                .buildings(30L)
                .transport(20L)
                .industrialProcesses(100L)
                .otherProcesses(50L)
                .total(200L)
                .build())
            .energySavingCategoriesExist(OptionalQuestion.YES)
            .energySavingsCategories(EnergySavingsCategories.builder()
                .energyManagementPractices(10L)
                .behaviourChangeInterventions(20L)
                .training(30L)
                .controlsImprovements(40L)
                .capitalInvestments(50L)
                .otherMeasures(20L)
                .total(200L)
                .build())
            .totalEnergySavingsEstimation(150L)
            .energySavingsRecommendationsExist(OptionalQuestion.YES)
            .energySavingsRecommendationsExist(OptionalQuestion.YES)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_TOTAL_ENERGY_SAVINGS_ESTIMATION.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_categories_invalid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
            .energySavingsCategories(EnergySavingsCategories.builder()
                .energyManagementPractices(10L)
                .behaviourChangeInterventions(20L)
                .training(30L)
                .controlsImprovements(40L)
                .capitalInvestments(30L)
                .otherMeasures(20L)
                .total(200L)
                .build())
            .totalEnergySavingsEstimation(150L)
            .energySavingsRecommendationsExist(OptionalQuestion.YES)
            .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build())
            .details("details")
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CATEGORIES.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100_skip_recommendations_valid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(30L)
                        .transport(20L)
                        .industrialProcesses(100L)
                        .otherProcesses(50L)
                        .total(200L)
                        .build())
                .energySavingCategoriesExist(OptionalQuestion.YES)
                .energySavingsCategories(EnergySavingsCategories.builder()
                        .energyManagementPractices(10L)
                        .behaviourChangeInterventions(20L)
                        .training(30L)
                        .controlsImprovements(40L)
                        .capitalInvestments(50L)
                        .otherMeasures(30L)
                        .total(220L)
                        .build())
                .energySavingsRecommendationsExist(OptionalQuestion.SKIP_QUESTION)
                .details("details")
                .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ESOS_ENERGY_ASSESSMENTS_95_TO_100_skip_categories_valid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(30L)
                        .transport(20L)
                        .industrialProcesses(100L)
                        .otherProcesses(50L)
                        .total(200L)
                        .build())
                .energySavingCategoriesExist(OptionalQuestion.SKIP_QUESTION)
                .energySavingsRecommendationsExist(OptionalQuestion.SKIP_QUESTION)
                .details("details")
                .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_skip_recommendations_valid() {
        final EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .totalEnergySavingsEstimation(150L)
                .energySavingsRecommendationsExist(OptionalQuestion.NO)
                .details("details")
                .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsAchieved(energySavingsAchieved)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

        when(nocSectionConstraintValidatorService.validate(energySavingsAchieved)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsAchieved);
    }
}

