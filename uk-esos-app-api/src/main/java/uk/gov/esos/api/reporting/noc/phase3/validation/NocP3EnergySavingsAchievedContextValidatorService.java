package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.apache.commons.lang3.ObjectUtils;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved.EnergySavingsAchieved;

import java.util.List;
import java.util.Set;

public class NocP3EnergySavingsAchievedContextValidatorService extends NocP3SectionValidatorService<EnergySavingsAchieved> implements NocP3SectionContextValidator {
    public NocP3EnergySavingsAchievedContextValidatorService(NocSectionConstraintValidatorService<EnergySavingsAchieved> nocSectionConstraintValidatorService) {
        super(nocSectionConstraintValidatorService);
    }

    @Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        EnergySavingsAchieved section = nocContainer.getNoc().getEnergySavingsAchieved();
        return this.validate(section, nocContainer, reportingObligationCategory);
    }

    @Override
    protected List<NocViolation> validateSection(EnergySavingsAchieved nocSection, NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        List<NocViolation> nocViolations = super.validateSection(nocSection, nocContainer, reportingObligationCategory);

        return switch (reportingObligationCategory) {
            case ISO_50001_COVERING_ENERGY_USAGE -> {

                if (ObjectUtils.isEmpty(nocSection.getTotalEnergySavingsEstimation())) {
                    nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_TOTAL_ENERGY_SAVINGS_ESTIMATION));
                }
                if (ObjectUtils.isNotEmpty(nocSection.getEnergySavingsEstimation())) {
                    nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CONSUMPTION));
                }
                if (ObjectUtils.isNotEmpty(nocSection.getEnergySavingCategoriesExist()) || ObjectUtils.isNotEmpty(nocSection.getEnergySavingsCategories())) {
                    nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CATEGORIES));
                }
                yield nocViolations;
            }
            case ESOS_ENERGY_ASSESSMENTS_95_TO_100, PARTIAL_ENERGY_ASSESSMENTS,
                    LESS_THAN_40000_KWH_PER_YEAR, ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100 -> {

                if (ObjectUtils.isNotEmpty(nocSection.getTotalEnergySavingsEstimation())) {
                    nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_TOTAL_ENERGY_SAVINGS_ESTIMATION));
                }
                if (ObjectUtils.isEmpty(nocSection.getEnergySavingsEstimation())) {
                    nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CONSUMPTION));
                }
                if (ObjectUtils.isEmpty(nocSection.getEnergySavingCategoriesExist())) {
                    nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CATEGORIES));
                }
                yield nocViolations;
            }
            default -> nocViolations;
        };
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
        return EnergySavingsAchieved.class.getName();
    }
}
