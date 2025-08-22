package uk.gov.esos.api.mireport.organisation.actionplansubmitteddata;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.mireport.common.actionplansubmitteddata.ActionPlanReportGenerator;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;
import uk.gov.esos.api.mireport.common.actionplansubmitteddata.ActionPlanSearchResults;
import uk.gov.esos.api.mireport.common.domain.dto.EmptyMiReportParams;
import uk.gov.esos.api.mireport.organisation.OrganisationMiReportGeneratorHandler;
import uk.gov.esos.api.reporting.common.domain.Phase;

@Service
public class ActionPlanReportGeneratorHandler extends ActionPlanReportGenerator
        implements OrganisationMiReportGeneratorHandler<EmptyMiReportParams> {

    private final ActionPlanCustomRepositoryImpl actionPlanCustomRepository;

    public ActionPlanReportGeneratorHandler(ActionPlanCustomRepositoryImpl actionPlanCustomRepository) {
        this.actionPlanCustomRepository = actionPlanCustomRepository;
    }

    @Override
    public ActionPlanSearchResults findActionPlanSubmittedData(EntityManager entityManager) {
        ReportingSearchCriteria criteria = ReportingSearchCriteria.builder()
                .accountType(AccountType.ORGANISATION)
                .phase(Phase.PHASE_3)
                .build();
        return actionPlanCustomRepository.findAll(entityManager, criteria);
    }

}
