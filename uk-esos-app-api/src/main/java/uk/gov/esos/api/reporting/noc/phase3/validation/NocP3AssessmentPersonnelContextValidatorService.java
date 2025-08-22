package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.assessmentpersonnel.AssessmentPersonnel;

import java.util.Set;

@Service
public class NocP3AssessmentPersonnelContextValidatorService extends NocP3SectionValidatorService<AssessmentPersonnel> implements NocP3SectionContextValidator {

    public NocP3AssessmentPersonnelContextValidatorService(NocSectionConstraintValidatorService<AssessmentPersonnel> nocSectionConstraintValidatorService) {
        super(nocSectionConstraintValidatorService);
    }

    @Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        AssessmentPersonnel section = nocContainer.getNoc().getAssessmentPersonnel();
        return this.validate(section, nocContainer, reportingObligationCategory);
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
        return AssessmentPersonnel.class.getName();
    }
}
