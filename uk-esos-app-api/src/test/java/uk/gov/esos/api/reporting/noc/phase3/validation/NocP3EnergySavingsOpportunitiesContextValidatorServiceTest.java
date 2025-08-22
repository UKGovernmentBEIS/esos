package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumptionPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategoriesPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.PotentialReductionPair;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsopportunities.EnergySavingsOpportunities;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ComplianceRouteDistribution;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligationDetails;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3EnergySavingsOpportunitiesContextValidatorServiceTest {

    @InjectMocks
    private NocP3EnergySavingsOpportunitiesContextValidatorService contextValidator;

    @Mock
    private NocSectionConstraintValidatorService<EnergySavingsOpportunities> nocSectionConstraintValidatorService;

    @Mock
    private PotentialReductionEnergyCostValidator potentialReductionEnergyCostValidator;

    @Test
    void validate() {
        final EnergyConsumptionPotentialReduction energyConsumption = EnergyConsumptionPotentialReduction.builder()
                .energyConsumptionTotal(200L).build();
        final EnergySavingsCategoriesPotentialReduction savingsCategories = EnergySavingsCategoriesPotentialReduction.builder()
                .energyConsumptionTotal(200L).build();
        final EnergySavingsOpportunities energySavingsOpportunities = EnergySavingsOpportunities.builder()
            .implementationEnergyConsumption(PotentialReductionPair.builder()
                        .energyConsumption(100L)
                        .energyCost(BigDecimal.valueOf(10.11))
                        .build())
            .energyConsumption(energyConsumption)
            .energySavingsCategories(savingsCategories)
            .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsOpportunities(energySavingsOpportunities)
                        .build())
                .build();

        when(nocSectionConstraintValidatorService.validate(energySavingsOpportunities)).thenReturn(Optional.empty());
        when(potentialReductionEnergyCostValidator.isEnergyConsumptionValid(energyConsumption)).thenReturn(true);
        when(potentialReductionEnergyCostValidator.isEnergySavingsCategoriesValid(savingsCategories)).thenReturn(true);


        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsOpportunities);
        verify(potentialReductionEnergyCostValidator, times(1)).isEnergyConsumptionValid(energyConsumption);
        verify(potentialReductionEnergyCostValidator, times(1)).isEnergySavingsCategoriesValid(savingsCategories);
    }

    @Test
    void validate_not_valid_for_category() {
        final EnergySavingsOpportunities energySavingsOpportunities = EnergySavingsOpportunities.builder()
             .implementationEnergyConsumption(PotentialReductionPair.builder()
                        .energyConsumption(100L)
                        .energyCost(BigDecimal.valueOf(10.11))
                        .build())
            .energyConsumption(EnergyConsumptionPotentialReduction.builder().build())
            .energySavingsCategories(EnergySavingsCategoriesPotentialReduction.builder().build())
            .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsOpportunities(energySavingsOpportunities)
                        .build())
                .build();

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
                .containsOnly(EnergySavingsOpportunities.class.getName());

        verifyNoInteractions(nocSectionConstraintValidatorService);
        verifyNoInteractions(potentialReductionEnergyCostValidator);
    }

    @Test
    void validateSection_energy_consumption_energyCostTotal_invalid() {
        final EnergyConsumptionPotentialReduction energyConsumption = EnergyConsumptionPotentialReduction.builder()
                .energyConsumptionTotal(120L).build();
        final EnergySavingsCategoriesPotentialReduction savingsCategories = EnergySavingsCategoriesPotentialReduction.builder()
                .energyConsumptionTotal(120L).build();
        final EnergySavingsOpportunities energySavingsOpportunities = EnergySavingsOpportunities.builder()
                .implementationEnergyConsumption(PotentialReductionPair.builder()
                        .energyConsumption(100L)
                        .energyCost(BigDecimal.valueOf(10.11))
                        .build())
                .energyConsumption(energyConsumption)
                .energySavingsCategories(savingsCategories)
                .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsOpportunities(energySavingsOpportunities)
                        .build())
                .build();

        when(nocSectionConstraintValidatorService.validate(energySavingsOpportunities)).thenReturn(Optional.empty());
        when(potentialReductionEnergyCostValidator.isEnergyConsumptionValid(energyConsumption)).thenReturn(false);
        when(potentialReductionEnergyCostValidator.isEnergySavingsCategoriesValid(savingsCategories)).thenReturn(true);

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_REDUCTION_COST.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
                .containsOnly(EnergySavingsOpportunities.class.getName());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsOpportunities);
        verify(potentialReductionEnergyCostValidator, times(1)).isEnergyConsumptionValid(energyConsumption);
        verify(potentialReductionEnergyCostValidator, times(1)).isEnergySavingsCategoriesValid(savingsCategories);
    }

    @Test
    void validateSection_energy_savings_categories_energyCostTotal_invalid() {
        final EnergyConsumptionPotentialReduction energyConsumption = EnergyConsumptionPotentialReduction.builder()
                .energyConsumptionTotal(120L).build();
        final EnergySavingsCategoriesPotentialReduction savingsCategories = EnergySavingsCategoriesPotentialReduction.builder()
                .energyConsumptionTotal(120L).build();
        final EnergySavingsOpportunities energySavingsOpportunities = EnergySavingsOpportunities.builder()
                .implementationEnergyConsumption(PotentialReductionPair.builder()
                        .energyConsumption(100L)
                        .energyCost(BigDecimal.valueOf(10.11))
                        .build())
                .energyConsumption(energyConsumption)
                .energySavingsCategories(savingsCategories)
                .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsOpportunities(energySavingsOpportunities)
                        .build())
                .build();

        when(nocSectionConstraintValidatorService.validate(energySavingsOpportunities)).thenReturn(Optional.empty());
        when(potentialReductionEnergyCostValidator.isEnergyConsumptionValid(energyConsumption)).thenReturn(true);
        when(potentialReductionEnergyCostValidator.isEnergySavingsCategoriesValid(savingsCategories)).thenReturn(false);

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CATEGORIES_COST.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
                .containsOnly(EnergySavingsOpportunities.class.getName());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsOpportunities);
        verify(potentialReductionEnergyCostValidator, times(1)).isEnergyConsumptionValid(energyConsumption);
        verify(potentialReductionEnergyCostValidator, times(1)).isEnergySavingsCategoriesValid(savingsCategories);
    }

    @Test
    void getApplicableReportingObligationCategories_energyAudits_zero_or_null() {
    	NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .reportingObligation(ReportingObligation.builder()
                        		.reportingObligationDetails(ReportingObligationDetails.builder()
                                		.complianceRouteDistribution(ComplianceRouteDistribution.builder()
                                				.build())
                                		.build())
                        		.build())
                        .build())
                .build();
    	
    	// energy audits do not exist
        assertThat(contextValidator.getApplicableReportingObligationCategories(nocContainer)).containsExactlyInAnyOrder(
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS
        );
        
        // energy audits are 0
        nocContainer.getNoc().getReportingObligation().getReportingObligationDetails()
        	.getComplianceRouteDistribution().setEnergyAuditsPct(0);
        
        assertThat(contextValidator.getApplicableReportingObligationCategories(nocContainer)).containsExactlyInAnyOrder(
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS
        );
    }
    
    @Test
    void getApplicableReportingObligationCategories_energyAudits_not_zero() {
    	NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .reportingObligation(ReportingObligation.builder()
                        		.reportingObligationDetails(ReportingObligationDetails.builder()
                                		.complianceRouteDistribution(ComplianceRouteDistribution.builder()
                                				.energyAuditsPct(100)
                                				.build())
                                		.build())
                        		.build())
                        .build())
                .build();
    	
        assertThat(contextValidator.getApplicableReportingObligationCategories(nocContainer)).containsExactlyInAnyOrder(
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR
        );
    }
}
