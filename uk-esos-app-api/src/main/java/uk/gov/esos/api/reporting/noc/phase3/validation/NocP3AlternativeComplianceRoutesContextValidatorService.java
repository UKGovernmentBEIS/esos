package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;

import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes.AlternativeComplianceRoutes;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ComplianceRouteDistribution;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligationDetails;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class NocP3AlternativeComplianceRoutesContextValidatorService extends NocP3SectionValidatorService<AlternativeComplianceRoutes> implements NocP3SectionContextValidator {

	private final PotentialReductionEnergyCostValidator potentialReductionEnergyCostValidator;

	public NocP3AlternativeComplianceRoutesContextValidatorService(
			NocSectionConstraintValidatorService<AlternativeComplianceRoutes> nocSectionConstraintValidatorService,
			PotentialReductionEnergyCostValidator potentialReductionEnergyCostValidator) {
		super(nocSectionConstraintValidatorService);
		this.potentialReductionEnergyCostValidator = potentialReductionEnergyCostValidator;
	}

	@Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
		AlternativeComplianceRoutes section = nocContainer.getNoc().getAlternativeComplianceRoutes();
        return this.validate(section, nocContainer, reportingObligationCategory);
    }

    @Override
    protected List<NocViolation> validateSection(AlternativeComplianceRoutes nocSection, NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
		List<NocViolation> nocViolations = super.validateSection(nocSection, nocContainer, reportingObligationCategory);

		return switch (reportingObligationCategory){
            case ISO_50001_COVERING_ENERGY_USAGE -> {
                // hide QID41,42, show QID100
                if(ObjectUtils.isNotEmpty(nocSection.getEnergyConsumptionReduction()) 
                		|| ObjectUtils.isNotEmpty(nocSection.getEnergyConsumptionReductionCategories())) {
                	nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_REDUCTION));
                }

                // dependency on QID 44, hide QID76,77
                validateComplianceRoutesIso50001(nocSection, nocViolations);

                yield nocViolations;
            }
            case PARTIAL_ENERGY_ASSESSMENTS, LESS_THAN_40000_KWH_PER_YEAR, ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100 -> {

                // validate dependencies on QID 44,17,76,77
                validateComplianceRoutes(nocSection, nocViolations, nocContainer.getNoc().getReportingObligation());

				// Validate consumption energy total cost
				if(!potentialReductionEnergyCostValidator.isEnergyConsumptionValid(nocSection.getEnergyConsumptionReduction())) {
					nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_REDUCTION_COST));
				}

				// Validate energy savings categories total cost
				if(!potentialReductionEnergyCostValidator.isEnergySavingsCategoriesValid(nocSection.getEnergyConsumptionReductionCategories())) {
					nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CATEGORIES_COST));
				}
                
                yield nocViolations;
            }
            default -> nocViolations;
        };
    }

	@Override
    protected Set<ReportingObligationCategory> getApplicableReportingObligationCategories(NocP3Container nocContainer) {
		boolean alternativeRoutesExist = Optional.ofNullable(nocContainer.getNoc().getReportingObligation())
    			.map(ReportingObligation::getReportingObligationDetails)
    			.map(ReportingObligationDetails::getComplianceRouteDistribution)
    			.map(ar -> ar.getIso50001Pct().compareTo(0) > 0 || 
    					ar.getDisplayEnergyCertificatePct().compareTo(0) > 0 || 
    					ar.getGreenDealAssessmentPct().compareTo(0) > 0)
    			.orElse(false);
		
		if (alternativeRoutesExist) {
			return Set.of(
	                ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE,
	                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
	                ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR,
	                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
	        );
		} else {
			return Set.of(
	                ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE,
	                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
	                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
	        );
		}
    }

    @Override
    protected String getSectionName() {
        return AlternativeComplianceRoutes.class.getName();
    }
    
    private void validateComplianceRoutesIso50001(AlternativeComplianceRoutes nocSection,
			List<NocViolation> nocViolations) {
		if(!assetAndCertificateExist(nocSection.getIso50001CertificateDetails(), nocSection.getAssets().getIso50001())) {
			nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ISO50001_DETAILS));
		}
		
		if(assetOrCertificateExist(nocSection.getDecCertificatesDetails(), nocSection.getAssets().getDec())) {
			nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_DEC_DETAILS));
		}
		
		if(assetOrCertificateExist(nocSection.getGdaCertificatesDetails(), nocSection.getAssets().getGda())) {
			nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_GDA_DETAILS));
		}
	}
    
    private void validateComplianceRoutes(AlternativeComplianceRoutes nocSection, List<NocViolation> nocViolations, ReportingObligation reportingObligationSection) {
		Optional<ComplianceRouteDistribution> complianceRouteDistributionOpt = Optional.ofNullable(reportingObligationSection)
			.map(ReportingObligation::getReportingObligationDetails)
			.map(ReportingObligationDetails::getComplianceRouteDistribution);

		complianceRouteDistributionOpt.ifPresentOrElse(complianceRouteDistribution -> {
			if (validateComplianceRoute(nocSection.getIso50001CertificateDetails(),
				nocSection.getAssets().getIso50001(), complianceRouteDistribution.getIso50001Pct())) {
				nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ISO50001_DETAILS));
			}
			if (validateComplianceRoute(nocSection.getDecCertificatesDetails(),
				nocSection.getAssets().getDec(), complianceRouteDistribution.getDisplayEnergyCertificatePct())) {
				nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_DEC_DETAILS));
			}
			if (validateComplianceRoute(nocSection.getGdaCertificatesDetails(),
				nocSection.getAssets().getGda(), complianceRouteDistribution.getGreenDealAssessmentPct())) {
				nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_GDA_DETAILS));
			}
		},
			() -> nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_DEPENDENT_SECTION_DATA, List.of(ReportingObligation.class.getName()))));
	}

	private <T> boolean validateComplianceRoute(T certificate, String asset, Integer distribution) {
		return distribution > 0 && !assetAndCertificateExist(certificate, asset)
				|| distribution == 0 && assetOrCertificateExist(certificate, asset);
	}
    
    private <T> boolean assetAndCertificateExist(T certificate, String asset) {
    	return ObjectUtils.isNotEmpty(certificate) 
    			&& ObjectUtils.isNotEmpty(asset);
    }
    
    private <T> boolean assetOrCertificateExist(T certificate, String asset) {
    	return ObjectUtils.isNotEmpty(certificate) 
    			|| ObjectUtils.isNotEmpty(asset);
    }
}
