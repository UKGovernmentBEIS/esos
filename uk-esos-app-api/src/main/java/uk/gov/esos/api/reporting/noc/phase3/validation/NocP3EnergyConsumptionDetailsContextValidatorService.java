package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.energyconsumptiondetails.EnergyConsumptionDetails;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ComplianceRouteDistribution;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligationDetails;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class NocP3EnergyConsumptionDetailsContextValidatorService
        extends NocP3SectionValidatorService<EnergyConsumptionDetails>
        implements NocP3SectionContextValidator {

    public NocP3EnergyConsumptionDetailsContextValidatorService(NocSectionConstraintValidatorService<EnergyConsumptionDetails> nocSectionConstraintValidatorService) {
        super(nocSectionConstraintValidatorService);
    }

    @Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        EnergyConsumptionDetails section = nocContainer.getNoc().getEnergyConsumptionDetails();
        return this.validate(section, nocContainer, reportingObligationCategory);
    }

    @Override
    protected List<NocViolation> validateSection(EnergyConsumptionDetails nocSection, NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        List<NocViolation> nocViolations = super.validateSection(nocSection, nocContainer, reportingObligationCategory);

        Optional<ComplianceRouteDistribution> complianceRouteDistributionOpt = Optional.ofNullable(nocContainer.getNoc().getReportingObligation())
                .map(ReportingObligation::getReportingObligationDetails)
                .map(ReportingObligationDetails::getComplianceRouteDistribution);

        complianceRouteDistributionOpt.ifPresentOrElse(complianceRouteDistribution -> {
            if (validateEnergyNotAuditedPct(nocSection.getSignificantEnergyConsumptionExists(), complianceRouteDistribution.getEnergyNotAuditedPct())) {
                nocViolations.add(new NocViolation(this.getSectionName(),NocViolation.NocViolationMessage.INVALID_SIGNIFICANT_ENERGY_CONSUMPTION_EXISTS_ENERGY_NOT_AUDITED));
            }
        }, () -> nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_DEPENDENT_SECTION_DATA, List.of(ReportingObligation.class.getName()))));

        return nocViolations;
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
        return EnergyConsumptionDetails.class.getName();
    }

    private boolean validateEnergyNotAuditedPct(boolean significantEnergyConsumptionExists, Integer energyNotAuditedPct) {
        return energyNotAuditedPct > 0 && !significantEnergyConsumptionExists;
    }
}
