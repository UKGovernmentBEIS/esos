package uk.gov.esos.api.reporting.noc.phase3.validation;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public abstract class NocP3SectionValidatorService<T extends NocP3Section> {

    private final NocSectionConstraintValidatorService<T> nocSectionConstraintValidatorService;

    public NocValidationResult validate(T nocSection, NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        boolean isSectionMandatory = this.getApplicableReportingObligationCategories(nocContainer).contains(reportingObligationCategory);

        if(!isSectionMandatory && ObjectUtils.isEmpty(nocSection)) {
            return NocValidationResult.validNoc();
        }

        if((isSectionMandatory && ObjectUtils.isEmpty(nocSection)) || !isSectionMandatory && ObjectUtils.isNotEmpty(nocSection)) {
            NocViolation nocViolation = new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_SECTION);
            return NocValidationResult.invalidNoc(List.of(nocViolation));
        }

        List<NocViolation> nocViolations = validateSection(nocSection, nocContainer, reportingObligationCategory);

        return NocValidationResult.builder().valid(nocViolations.isEmpty()).nocViolations(nocViolations).build();
    }

    protected List<NocViolation> validateSection(T nocSection, NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory){
        List<NocViolation> nocViolations = new ArrayList<>();
        nocSectionConstraintValidatorService.validate(nocSection).ifPresent(nocViolations::add);
        return nocViolations;
    }

    protected abstract Set<ReportingObligationCategory> getApplicableReportingObligationCategories(NocP3Container nocContainer);

    protected abstract String getSectionName();
}
