package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure.OrganisationStructure;

import java.util.Set;

@Service
public class NocP3OrganisationStructureContextValidatorService extends NocP3SectionValidatorService<OrganisationStructure> implements NocP3SectionContextValidator {

    public NocP3OrganisationStructureContextValidatorService(NocSectionConstraintValidatorService<OrganisationStructure> nocSectionConstraintValidatorService) {
        super(nocSectionConstraintValidatorService);
    }

    @Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
		OrganisationStructure section = nocContainer.getNoc().getOrganisationStructure();
        return this.validate(section, nocContainer, reportingObligationCategory);
    }

    @Override
    protected Set<ReportingObligationCategory> getApplicableReportingObligationCategories(NocP3Container nocContainer) {
        return ReportingObligationCategory.getQualifyCategories();
    }

    @Override
    protected String getSectionName() {
        return OrganisationStructure.class.getName();
    }
}
