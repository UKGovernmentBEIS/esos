package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute.ComplianceRoute;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligationDetails;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class NocP3ComplianceRouteContextValidatorService extends NocP3SectionValidatorService<ComplianceRoute> implements NocP3SectionContextValidator {

    public NocP3ComplianceRouteContextValidatorService(NocSectionConstraintValidatorService<ComplianceRoute> nocSectionConstraintValidatorService) {
        super(nocSectionConstraintValidatorService);
    }

    @Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
		ComplianceRoute section = nocContainer.getNoc().getComplianceRoute();
        return this.validate(section, nocContainer, reportingObligationCategory);
    }

    @Override
    protected List<NocViolation> validateSection(ComplianceRoute nocSection, NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        List<NocViolation> nocViolations = super.validateSection(nocSection, nocContainer, reportingObligationCategory);

        if(Set.of(
        		ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE, 
        		ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100).contains(reportingObligationCategory)
        		|| (ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR.equals(reportingObligationCategory) && 
        				!hasEnergyAudit(nocContainer))) {
        	
        	// Hide QID20, QID21, QID22, QID23, QID25, QID110
            validateEnergyConsumptionData(nocSection, nocViolations, false);    
        } else if(Set.of(
        		ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100, 
        		ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS).contains(reportingObligationCategory)
        		|| (ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR.equals(reportingObligationCategory) && 
        				hasEnergyAudit(nocContainer))) {
        	
        	// Validate mandatory energy consumption questions
        	validateEnergyConsumptionData(nocSection, nocViolations, true);
        }
        
        return nocViolations;
    }

	private boolean hasEnergyAudit(NocP3Container nocContainer) {
		return Optional.ofNullable(nocContainer.getNoc().getReportingObligation())
    			.map(ReportingObligation::getReportingObligationDetails)
    			.map(ReportingObligationDetails::getComplianceRouteDistribution)
    			.map(crd -> crd.getEnergyAuditsPct().compareTo(0) > 0)
    			.orElse(false);
	}

	@Override
    protected Set<ReportingObligationCategory> getApplicableReportingObligationCategories(NocP3Container nocContainer) {
        return Set.of(
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
                ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR,
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
        );
    }

    @Override
    protected String getSectionName() {
        return ComplianceRoute.class.getName();
    }
    
    private void validateEnergyConsumptionData(ComplianceRoute nocSection, List<NocViolation> nocViolations, boolean shouldExist) {
    	if(shouldExist && energyConsumptionDataNotExist(nocSection) || (!shouldExist && energyConsumptionDataExist(nocSection))) {
            nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_DATA));
        }
	}

	private boolean energyConsumptionDataExist(ComplianceRoute nocSection) {
		return ObjectUtils.isNotEmpty(nocSection.getAreTwelveMonthsVerifiableDataUsed())
    			|| ObjectUtils.isNotEmpty(nocSection.getTwelveMonthsVerifiableDataUsedReason())
                || ObjectUtils.isNotEmpty(nocSection.getEnergyConsumptionProfilingUsed())
                || ObjectUtils.isNotEmpty(nocSection.getAreEnergyConsumptionProfilingMethodsRecorded())
                || CollectionUtils.isNotEmpty(nocSection.getEnergyAudits())
                || ObjectUtils.isNotEmpty(nocSection.getIsEnergyConsumptionProfilingNotUsedRecorded());
	}
	
	private boolean energyConsumptionDataNotExist(ComplianceRoute nocSection) {
		return ObjectUtils.isEmpty(nocSection.getAreTwelveMonthsVerifiableDataUsed())
				|| ObjectUtils.isEmpty(nocSection.getEnergyConsumptionProfilingUsed())
				|| CollectionUtils.isEmpty(nocSection.getEnergyAudits());
	}
}
