package uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import uk.gov.esos.api.reporting.noc.phase3.domain.OptionalQuestion;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ComplianceRouteTest {

	private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_when_all_true_valid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
            .estimatedCalculationTypes(Set.of(
            		EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION, 
            		EstimatedCalculationType.CONVERSION_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION))
            .areTwelveMonthsVerifiableDataUsed(Boolean.TRUE)
            .areEstimationMethodsRecorded(OptionalQuestion.YES)
            .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.YES)
            .areEnergyConsumptionProfilingMethodsRecorded(OptionalQuestion.YES)
            .energyAudits(buildEnergyAudit())
            .partsProhibitedFromDisclosingExist(Boolean.TRUE)
            .partsProhibitedFromDisclosing("test")
            .partsProhibitedFromDisclosingReason("test2")
            .build();

        final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_TwelveMonthsVerifiableData_false_valid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
            .estimatedCalculationTypes(Set.of(
            		EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION, 
            		EstimatedCalculationType.CONVERSION_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION))
            .areTwelveMonthsVerifiableDataUsed(Boolean.FALSE)
            .twelveMonthsVerifiableDataUsedReason("reason")
            .areEstimationMethodsRecorded(OptionalQuestion.YES)
            .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.YES)
            .areEnergyConsumptionProfilingMethodsRecorded(OptionalQuestion.YES)
            .energyAudits(buildEnergyAudit())
            .partsProhibitedFromDisclosingExist(Boolean.FALSE)
            .build();

        final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);

        assertThat(violations).isEmpty();
    }
    

	@Test
    void validate_when_EnergyConsumptionProfiling_twelveMonthsVerifiableDataUsed_are_null_valid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
                .estimatedCalculationTypes(Set.of(EstimatedCalculationType.NONE_OF_THE_ABOVE))
                .areEstimationMethodsRecorded(OptionalQuestion.NO)
                .partsProhibitedFromDisclosingExist(Boolean.FALSE)
                .build();

    	final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);

    	assertThat(violations).isEmpty();
    }
	
	@Test
    void validate_when_estimatedCalculationTypes_include_none_invalid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
                .estimatedCalculationTypes(Set.of(
                		EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION,
                		EstimatedCalculationType.NONE_OF_THE_ABOVE))
                .areEstimationMethodsRecorded(OptionalQuestion.NO)
                .partsProhibitedFromDisclosingExist(Boolean.FALSE)
                .build();

    	final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);
    	
    	assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
        	.containsExactly("{noc.complianceroute.estimatedCalculationTypes}");
    }
	
	@Test
    void validate_when_twelveMonthsVerifiableDataUsedReason_not_exist_invalid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
    			.estimatedCalculationTypes(Set.of(EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION))
    			.areTwelveMonthsVerifiableDataUsed(Boolean.FALSE)
    			.areEstimationMethodsRecorded(OptionalQuestion.YES)
                .partsProhibitedFromDisclosingExist(Boolean.FALSE)
                .build();

            final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);

            assertThat(violations).isNotEmpty();
            assertThat(violations).extracting(ConstraintViolation::getMessage)
            	.containsExactly("{noc.complianceroute.twelveMonthsVerifiableDataUsedReason}");
    }

    @Test
    void validate_when_areEnergyConsumptionProfilingMethodsRecorded_invalid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
    			.estimatedCalculationTypes(Set.of(EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION))
    			.areEstimationMethodsRecorded(OptionalQuestion.YES)
                .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.YES)
                .partsProhibitedFromDisclosingExist(Boolean.FALSE)
                .build();

            final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);

            assertThat(violations).isNotEmpty();
            assertThat(violations).extracting(ConstraintViolation::getMessage)
            	.containsExactly("{noc.complianceroute.areEnergyConsumptionProfilingMethodsRecorded}");
    }
    
    @Test
    void validate_when_partsProhibitedFromDisclosing_invalid() {
    	ComplianceRoute complianceRoute = ComplianceRoute.builder()
    			.estimatedCalculationTypes(Set.of(EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION))
    			.areEstimationMethodsRecorded(OptionalQuestion.YES)
                .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.YES)
                .areEnergyConsumptionProfilingMethodsRecorded(OptionalQuestion.SKIP_QUESTION)
                .partsProhibitedFromDisclosingExist(Boolean.TRUE)
                .build();
    	
    	final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);
    	
    	assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactlyInAnyOrder(
        		"{noc.complianceroute.partsProhibitedFromDisclosing}", "{noc.complianceroute.partsProhibitedFromDisclosingReason}");
    }

    @Test
    void validate_when_energyConsumptionProfilingUsed_true_invalid() {
        ComplianceRoute complianceRoute = ComplianceRoute.builder()
        		.estimatedCalculationTypes(Set.of(EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION))
        		.areEstimationMethodsRecorded(OptionalQuestion.SKIP_QUESTION)
                .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.YES)
                .areEnergyConsumptionProfilingMethodsRecorded(OptionalQuestion.SKIP_QUESTION)
                .isEnergyConsumptionProfilingNotUsedRecorded(OptionalQuestion.YES)
                .partsProhibitedFromDisclosingExist(Boolean.TRUE)
                .partsProhibitedFromDisclosing("test")
                .partsProhibitedFromDisclosingReason("test2")
                .build();

        final Set<ConstraintViolation<ComplianceRoute>> violations = validator.validate(complianceRoute);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.complianceroute.isEnergyConsumptionProfilingNotUsedRecorded}");
    }

    private List<EnergyAudit> buildEnergyAudit() {
		return List.of(EnergyAudit.builder()
				.description("desc")
				.numberOfSitesCovered(1)
				.numberOfSitesVisited(2)
				.reason("reason")
				.build());
	}
}
