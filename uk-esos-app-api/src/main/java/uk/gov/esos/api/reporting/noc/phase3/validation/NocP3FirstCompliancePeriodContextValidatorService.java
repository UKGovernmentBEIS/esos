package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.firstcomplianceperiod.FirstCompliancePeriod;
import java.util.Set;

@Service
public class NocP3FirstCompliancePeriodContextValidatorService extends NocP3SectionValidatorService<FirstCompliancePeriod> implements NocP3SectionContextValidator {

    public NocP3FirstCompliancePeriodContextValidatorService(NocSectionConstraintValidatorService<FirstCompliancePeriod> nocSectionConstraintValidatorService) {
        super(nocSectionConstraintValidatorService);
    }

    @Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
    	FirstCompliancePeriod section = nocContainer.getNoc().getFirstCompliancePeriod();
        return this.validate(section, nocContainer, reportingObligationCategory);
    }

    @Override
    protected Set<ReportingObligationCategory> getApplicableReportingObligationCategories(NocP3Container nocContainer) {
        return ReportingObligationCategory.getQualifyCategories();
    }

    @Override
    protected String getSectionName() {
        return FirstCompliancePeriod.class.getName();
    }
}
