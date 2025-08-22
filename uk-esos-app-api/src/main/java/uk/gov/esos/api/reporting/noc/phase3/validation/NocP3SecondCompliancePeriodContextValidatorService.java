package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.secondcomplianceperiod.SecondCompliancePeriod;

import java.util.Set;

@Service
public class NocP3SecondCompliancePeriodContextValidatorService extends NocP3SectionValidatorService<SecondCompliancePeriod> implements NocP3SectionContextValidator {

    public NocP3SecondCompliancePeriodContextValidatorService(NocSectionConstraintValidatorService<SecondCompliancePeriod> nocSectionConstraintValidatorService) {
        super(nocSectionConstraintValidatorService);
    }

    @Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
    	SecondCompliancePeriod section = nocContainer.getNoc().getSecondCompliancePeriod();
        return this.validate(section, nocContainer, reportingObligationCategory);
    }

    @Override
    protected Set<ReportingObligationCategory> getApplicableReportingObligationCategories(NocP3Container nocContainer) {
        return ReportingObligationCategory.getQualifyCategories();
    }

    @Override
    protected String getSectionName() {
        return SecondCompliancePeriod.class.getName();
    }
}
