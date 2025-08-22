package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsopportunities.EnergySavingsOpportunities;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ComplianceRouteDistribution;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligationDetails;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class NocP3EnergySavingsOpportunitiesContextValidatorService extends NocP3SectionValidatorService<EnergySavingsOpportunities> implements NocP3SectionContextValidator {

    private final PotentialReductionEnergyCostValidator potentialReductionEnergyCostValidator;

    public NocP3EnergySavingsOpportunitiesContextValidatorService(
            NocSectionConstraintValidatorService<EnergySavingsOpportunities> nocSectionConstraintValidatorService,
            PotentialReductionEnergyCostValidator potentialReductionEnergyCostValidator) {
        super(nocSectionConstraintValidatorService);
        this.potentialReductionEnergyCostValidator = potentialReductionEnergyCostValidator;
    }

    @Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        EnergySavingsOpportunities section = nocContainer.getNoc().getEnergySavingsOpportunities();
        return this.validate(section, nocContainer, reportingObligationCategory);
    }

    @Override
    protected List<NocViolation> validateSection(EnergySavingsOpportunities nocSection, NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        List<NocViolation> nocViolations = super.validateSection(nocSection, nocContainer, reportingObligationCategory);

        // Validate consumption energy total cost
        if(!potentialReductionEnergyCostValidator.isEnergyConsumptionValid(nocSection.getEnergyConsumption())) {
            nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_REDUCTION_COST));
        }

        // Validate energy savings categories total cost
        if(!potentialReductionEnergyCostValidator.isEnergySavingsCategoriesValid(nocSection.getEnergySavingsCategories())) {
            nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CATEGORIES_COST));
        }

        return nocViolations;
    }

    @Override
    protected Set<ReportingObligationCategory> getApplicableReportingObligationCategories(NocP3Container nocContainer) {
    	Integer energyAudits = Optional.ofNullable(nocContainer.getNoc().getReportingObligation())
    			.map(ReportingObligation::getReportingObligationDetails)
    			.map(ReportingObligationDetails::getComplianceRouteDistribution)
    			.map(ComplianceRouteDistribution::getEnergyAuditsPct)
    			.orElse(0);
    	
    		if (energyAudits.compareTo(0) > 0) {
    			return Set.of(
    	                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
    	                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
    	                ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR
    	        );
    		} else {
    			return Set.of(
    	                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
    	                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS
    	        );
    		} 
    }

    @Override
    protected String getSectionName() {
        return EnergySavingsOpportunities.class.getName();
    }
}
