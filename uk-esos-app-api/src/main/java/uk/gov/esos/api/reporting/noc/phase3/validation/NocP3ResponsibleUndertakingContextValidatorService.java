package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountValidationService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ResponsibleUndertaking;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ReviewOrganisationDetails;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class NocP3ResponsibleUndertakingContextValidatorService extends NocP3SectionValidatorService<ResponsibleUndertaking> implements NocP3SectionContextValidator {

    private final OrganisationAccountValidationService organisationAccountValidationService;

    public NocP3ResponsibleUndertakingContextValidatorService(
        NocSectionConstraintValidatorService<ResponsibleUndertaking> nocSectionConstraintValidatorService,
        OrganisationAccountValidationService organisationAccountValidationService
    ) {
        super(nocSectionConstraintValidatorService);
        this.organisationAccountValidationService = organisationAccountValidationService;
    }

    @Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        ResponsibleUndertaking section = nocContainer.getNoc().getResponsibleUndertaking();
        return this.validate(section, nocContainer, reportingObligationCategory);
    }

    @Override
    protected List<NocViolation> validateSection(ResponsibleUndertaking nocSection, NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        List<NocViolation> nocViolations = super.validateSection(nocSection, nocContainer, reportingObligationCategory);

        String registrationNumber = Optional.ofNullable(nocSection.getOrganisationDetails())
            .map(ReviewOrganisationDetails::getRegistrationNumber)
            .orElse(null);

        try {
            organisationAccountValidationService.validateCompanyExistence(registrationNumber);
        } catch (BusinessException ex) {
            if(ex.getErrorCode().equals(ErrorCode.RESOURCE_NOT_FOUND)) {
                nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_REGISTRATION_NUMBER));
            } else {
                throw ex;
            }
        }

        return nocViolations;
    }

    @Override
    public Set<ReportingObligationCategory> getApplicableReportingObligationCategories(NocP3Container nocContainer) {
        return ReportingObligationCategory.getQualifyCategories();
    }

    @Override
    protected String getSectionName() {
        return ResponsibleUndertaking.class.getName();
    }
}
