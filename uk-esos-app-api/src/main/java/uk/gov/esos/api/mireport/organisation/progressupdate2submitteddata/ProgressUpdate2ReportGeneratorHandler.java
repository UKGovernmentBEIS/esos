package uk.gov.esos.api.mireport.organisation.progressupdate2submitteddata;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.mireport.common.domain.dto.EmptyMiReportParams;
import uk.gov.esos.api.mireport.common.progressupdate2submitteddata.ProgressUpdate2ReportGenerator;
import uk.gov.esos.api.mireport.common.progressupdate2submitteddata.ProgressUpdate2SearchResults;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;
import uk.gov.esos.api.mireport.organisation.OrganisationMiReportGeneratorHandler;
import uk.gov.esos.api.reporting.common.domain.Phase;

@Service
public class ProgressUpdate2ReportGeneratorHandler extends ProgressUpdate2ReportGenerator implements OrganisationMiReportGeneratorHandler<EmptyMiReportParams> {

    private final ProgressUpdate2CustomRepositoryImpl progressUpdate2CustomRepository;

    public ProgressUpdate2ReportGeneratorHandler(ProgressUpdate2CustomRepositoryImpl progressUpdate2CustomRepository) {
        this.progressUpdate2CustomRepository = progressUpdate2CustomRepository;
    }

    @Override
    public ProgressUpdate2SearchResults findProgressUpdate2SubmittedData(EntityManager entityManager) {
        ReportingSearchCriteria criteria = ReportingSearchCriteria.builder()
                .accountType(AccountType.ORGANISATION)
                .phase(Phase.PHASE_3)
                .build();
        return progressUpdate2CustomRepository.findAll(entityManager, criteria);
    }
}
