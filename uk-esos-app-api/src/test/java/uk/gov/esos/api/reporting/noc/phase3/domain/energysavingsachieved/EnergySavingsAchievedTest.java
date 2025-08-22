package uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.OptionalQuestion;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class EnergySavingsAchievedTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_valid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(10L)
                        .transport(20L)
                        .industrialProcesses(30L)
                        .otherProcesses(40L)
                        .total(100L)
                        .build())
                .energySavingCategoriesExist(OptionalQuestion.YES)
                .energySavingsCategories(EnergySavingsCategories.builder()
                        .energyManagementPractices(10L)
                        .behaviourChangeInterventions(20L)
                        .training(30L)
                        .controlsImprovements(40L)
                        .capitalInvestments(50L)
                        .otherMeasures(20L)
                        .total(170L)
                        .build())
                .energySavingsRecommendationsExist(OptionalQuestion.YES)
                .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                        .energyAudits(30)
                        .alternativeComplianceRoutes(40)
                        .other(30)
                        .total(100)
                        .build())
                .details("details")
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_no_energy_saving_categories_no_recommendations_valid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(10L)
                        .transport(20L)
                        .industrialProcesses(30L)
                        .otherProcesses(40L)
                        .total(100L)
                        .build())
                .energySavingCategoriesExist(OptionalQuestion.NO)
                .energySavingsRecommendationsExist(OptionalQuestion.NO)
                .details("details")
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isEmpty();
    }

    @Test
    void when_energy_savings_categories_recommendations_false_invalid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(10L)
                        .transport(20L)
                        .industrialProcesses(30L)
                        .otherProcesses(40L)
                        .total(100L)
                        .build())
                .energySavingCategoriesExist(OptionalQuestion.NO)
                .energySavingsCategories(EnergySavingsCategories.builder()
                        .energyManagementPractices(10L)
                        .behaviourChangeInterventions(20L)
                        .training(30L)
                        .controlsImprovements(40L)
                        .capitalInvestments(50L)
                        .otherMeasures(20L)
                        .total(170L)
                        .build())
                .energySavingsRecommendationsExist(OptionalQuestion.NO)
                .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                        .energyAudits(30)
                        .alternativeComplianceRoutes(40)
                        .other(30)
                        .total(100)
                        .build())
                .details("details")
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).hasSize(2);
    }

    @Test
    void validate_energy_saving_categories_recommendations_exist_no_values_valid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(10L)
                        .transport(20L)
                        .industrialProcesses(30L)
                        .otherProcesses(40L)
                        .total(100L)
                        .build())
                .energySavingCategoriesExist(OptionalQuestion.YES)
                .energySavingsRecommendationsExist(OptionalQuestion.YES)
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_noenergy_savings_estimation_valid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .totalEnergySavingsEstimation(120L)
                .energySavingsRecommendationsExist(OptionalQuestion.YES)
                .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                        .energyAudits(50)
                        .alternativeComplianceRoutes(50)
                        .other(50)
                        .total(150)
                        .build())
                .details("details")
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_energy_savings_estimation_missing_values_invalid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(10L)
                        .transport(20L)
                        .industrialProcesses(30L)
                        .total(60L)
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
                        .energyAudits(80)
                        .alternativeComplianceRoutes(80)
                        .other(80)
                        .total(240)
                        .build())
                .details("details")
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).contains(
                "{noc.energysavingsachieved.energySavingsEstimation.exist}");
    }

    @Test
    void validate_skip_energy_saving_categories_skip_recommendations_valid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(10L)
                        .transport(20L)
                        .industrialProcesses(30L)
                        .otherProcesses(40L)
                        .total(100L)
                        .build())
                .energySavingCategoriesExist(OptionalQuestion.SKIP_QUESTION)
                .energySavingsRecommendationsExist(OptionalQuestion.SKIP_QUESTION)
                .details("details")
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isEmpty();
    }

    @Test
    void when_energy_savings_categories_recommendations_skip_invalid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(10L)
                        .transport(20L)
                        .industrialProcesses(30L)
                        .otherProcesses(40L)
                        .total(100L)
                        .build())
                .energySavingCategoriesExist(OptionalQuestion.SKIP_QUESTION)
                .energySavingsCategories(EnergySavingsCategories.builder()
                        .energyManagementPractices(10L)
                        .behaviourChangeInterventions(20L)
                        .training(30L)
                        .controlsImprovements(40L)
                        .capitalInvestments(50L)
                        .otherMeasures(20L)
                        .total(170L)
                        .build())
                .energySavingsRecommendationsExist(OptionalQuestion.SKIP_QUESTION)
                .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                        .energyAudits(30)
                        .alternativeComplianceRoutes(40)
                        .other(30)
                        .total(100)
                        .build())
                .details("details")
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).hasSize(2);
    }

    @Test
    void validate_missing_values_valid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(10L)
                        .transport(20L)
                        .industrialProcesses(30L)
                        .otherProcesses(40L)
                        .total(100L)
                        .build())
                .energySavingCategoriesExist(OptionalQuestion.YES)
                .energySavingsCategories(EnergySavingsCategories.builder()
                        .energyManagementPractices(10L)
                        .training(30L)
                        .controlsImprovements(40L)
                        .capitalInvestments(50L)
                        .total(130L)
                        .build())
                .energySavingsRecommendationsExist(OptionalQuestion.YES)
                .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                        .energyAudits(30)
                        .alternativeComplianceRoutes(40)
                        .total(70)
                        .build())
                .details("details")
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_all_values_null_valid() {
        EnergySavingsAchieved energySavingsAchieved = EnergySavingsAchieved.builder()
                .energySavingsEstimation(EnergyConsumption.builder()
                        .buildings(10L)
                        .transport(20L)
                        .industrialProcesses(30L)
                        .otherProcesses(40L)
                        .total(100L)
                        .build())
                .energySavingCategoriesExist(OptionalQuestion.YES)
                .energySavingsCategories(EnergySavingsCategories.builder()
                        .build())
                .energySavingsRecommendationsExist(OptionalQuestion.YES)
                .energySavingsRecommendations(EnergySavingsRecommendations.builder()
                        .build())
                .details("details")
                .build();

        final Set<ConstraintViolation<EnergySavingsAchieved>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isEmpty();
    }
}
