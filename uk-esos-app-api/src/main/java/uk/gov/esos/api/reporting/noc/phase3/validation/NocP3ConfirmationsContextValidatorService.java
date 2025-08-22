package uk.gov.esos.api.reporting.noc.phase3.validation;

import com.google.common.collect.Sets;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.confirmations.Confirmations;
import uk.gov.esos.api.reporting.noc.phase3.domain.confirmations.NoEnergyResponsibilityAssessmentType;
import uk.gov.esos.api.reporting.noc.phase3.domain.confirmations.ResponsibilityAssessmentType;
import uk.gov.esos.api.reporting.noc.phase3.domain.leadassessor.LeadAssessor;
import uk.gov.esos.api.reporting.noc.phase3.domain.leadassessor.LeadAssessorType;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NocP3ConfirmationsContextValidatorService extends NocP3SectionValidatorService<Confirmations> implements NocP3SectionContextValidator {

    public NocP3ConfirmationsContextValidatorService(NocSectionConstraintValidatorService<Confirmations> nocSectionConstraintValidatorService) {
        super(nocSectionConstraintValidatorService);
    }

    @Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        Confirmations section = nocContainer.getNoc().getConfirmations();
        return this.validate(section, nocContainer, reportingObligationCategory);
    }

    @Override
    protected List<NocViolation> validateSection(Confirmations nocSection, NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        List<NocViolation> nocViolations = super.validateSection(nocSection, nocContainer, reportingObligationCategory);

        return switch (reportingObligationCategory){
            case ISO_50001_COVERING_ENERGY_USAGE -> {

                // Validate assessment types
                validateEnergyAssessmentTypes(nocSection, nocViolations, true);

                // Validate date
                validateReviewAssessmentDate(nocSection, nocViolations, true);

                // Hide QID49, QID50
                validateSecondResponsibleOfficerDetails(nocSection, nocViolations, false);

                yield nocViolations;
            }
            case ZERO_ENERGY -> {

                // Validate assessment types Hide QID45
                validateEnergyAssessmentTypes(nocSection, nocViolations, false);

                // Hide QID48
                validateReviewAssessmentDate(nocSection, nocViolations, false);

                // Hide QID49, QID50
                validateSecondResponsibleOfficerDetails(nocSection, nocViolations, false);

                yield nocViolations;
            }
            case LESS_THAN_40000_KWH_PER_YEAR -> {

                // Validate assessment types
                validateEnergyAssessmentTypes(nocSection, nocViolations, true);

                // Validate date
                validateReviewAssessmentDate(nocSection, nocViolations, true);

                // Validate second responsible officer
                validateSecondResponsibleOfficerDetails(nocSection, nocViolations, true);

                yield nocViolations;
            }
            case ESOS_ENERGY_ASSESSMENTS_95_TO_100, PARTIAL_ENERGY_ASSESSMENTS, ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100 -> {

                // Validate assessment types
                validateEnergyAssessmentTypes(nocSection, nocViolations, true);

                // Validate date
                validateReviewAssessmentDate(nocSection, nocViolations, true);

                // Validate LeadAssessorType
                validateSecondResponsibleOfficerDetailsAgainstLeadAccessor(nocSection, nocContainer.getNoc().getLeadAssessor(), nocViolations);

                yield nocViolations;
            }
            default -> nocViolations;
        };
    }

    @Override
    protected Set<ReportingObligationCategory> getApplicableReportingObligationCategories(NocP3Container nocContainer) {
        return ReportingObligationCategory.getQualifyCategories();
    }

    @Override
    protected String getSectionName() {
        return Confirmations.class.getName();
    }

    private void validateEnergyAssessmentTypes(Confirmations nocSection, List<NocViolation> nocViolations, boolean hasEnergy) {
        if(hasEnergy) {
            // All energy assessment types are checked
            validateAllEnergyTypesChecked(nocSection.getResponsibilityAssessmentTypes(), nocViolations);

            // No energy assessment types should not exist
            if(!nocSection.getNoEnergyResponsibilityAssessmentTypes().isEmpty()) {
                nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_NO_ENERGY_RESPONSIBILITY_ASSESSMENT_TYPE));
            }
        }
        else {
            // All no energy assessment types are checked
            validateAllNoEnergyTypesChecked(nocSection.getNoEnergyResponsibilityAssessmentTypes(), nocViolations);

            // Energy assessment types should not exist
            if(!nocSection.getResponsibilityAssessmentTypes().isEmpty()) {
                nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_RESPONSIBILITY_ASSESSMENT_TYPE));
            }
        }
    }

    private void validateReviewAssessmentDate(Confirmations nocSection, List<NocViolation> nocViolations, boolean mandatory) {
        if((ObjectUtils.isEmpty(nocSection.getReviewAssessmentDate()) && mandatory)
                || (ObjectUtils.isNotEmpty(nocSection.getReviewAssessmentDate()) && !mandatory)) {
            nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_REVIEW_ASSESSMENT_DATE));
        }
    }

    private void validateSecondResponsibleOfficerDetailsAgainstLeadAccessor(Confirmations nocSection, LeadAssessor leadAssessorSection,
                                                                            List<NocViolation> nocViolations) {
        if(Objects.nonNull(leadAssessorSection)) {
            validateSecondResponsibleOfficerDetails(nocSection, nocViolations,
                LeadAssessorType.INTERNAL.equals(leadAssessorSection.getLeadAssessorType()));
        } else {
            nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_DEPENDENT_SECTION_DATA, List.of(LeadAssessor.class.getName())));
        }
    }

    private void validateSecondResponsibleOfficerDetails(Confirmations nocSection, List<NocViolation> nocViolations, boolean mandatory) {
        if(mandatory) {
            if(ObjectUtils.isEmpty(nocSection.getSecondResponsibleOfficerDetails())
                    || nocSection.getSecondResponsibleOfficerEnergyTypes().isEmpty()) {
                nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_SECOND_RESPONSIBLE_OFFICER_DETAILS));
            }

            // All second responsible officer energy assessment types are checked
            validateAllEnergyTypesChecked(nocSection.getSecondResponsibleOfficerEnergyTypes(), nocViolations);
        }
        else {
            if(ObjectUtils.isNotEmpty(nocSection.getSecondResponsibleOfficerDetails())
                    || !nocSection.getSecondResponsibleOfficerEnergyTypes().isEmpty()) {
                nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_SECOND_RESPONSIBLE_OFFICER_DETAILS));
            }
        }
    }

    private void validateAllEnergyTypesChecked(Set<ResponsibilityAssessmentType> types, List<NocViolation> nocViolations) {
        Set<ResponsibilityAssessmentType> assessmentTypes = Arrays.stream(ResponsibilityAssessmentType.values()).collect(Collectors.toSet());
        Set<ResponsibilityAssessmentType> diffs = Sets.difference(assessmentTypes, types);
        if(!diffs.isEmpty()) {
            nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_RESPONSIBILITY_ASSESSMENT_TYPE_LIST, diffs));
        }
    }

    private void validateAllNoEnergyTypesChecked(Set<NoEnergyResponsibilityAssessmentType> types, List<NocViolation> nocViolations) {
        Set<NoEnergyResponsibilityAssessmentType> noEnergyTypes = Arrays.stream(NoEnergyResponsibilityAssessmentType.values()).collect(Collectors.toSet());
        Set<NoEnergyResponsibilityAssessmentType> diffs = Sets.difference(noEnergyTypes, types);
        if(!diffs.isEmpty()) {
            nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_NO_ENERGY_RESPONSIBILITY_ASSESSMENT_TYPE_LIST, diffs));
        }
    }
}
