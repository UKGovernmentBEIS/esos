package uk.gov.esos.api.mireport.organisation.progressupdate1submitteddata;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.mireport.common.domain.dto.EmptyMiReportParams;
import uk.gov.esos.api.mireport.common.progressupdate1submitteddata.ProgressUpdate1ReportGenerator;
import uk.gov.esos.api.mireport.common.progressupdate1submitteddata.ProgressUpdate1SearchResults;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;
import uk.gov.esos.api.mireport.organisation.OrganisationMiReportGeneratorHandler;
import uk.gov.esos.api.reporting.common.domain.Phase;

@Service
public class ProgressUpdate1ReportGeneratorHandler extends ProgressUpdate1ReportGenerator implements OrganisationMiReportGeneratorHandler<EmptyMiReportParams> {

    private final ProgressUpdate1CustomRepositoryImpl progressUpdate1CustomRepository;

    public ProgressUpdate1ReportGeneratorHandler(ProgressUpdate1CustomRepositoryImpl progressUpdate1CustomRepository) {
        this.progressUpdate1CustomRepository = progressUpdate1CustomRepository;
    }

    @Override
    public ProgressUpdate1SearchResults findProgressUpdate1SubmittedData(EntityManager entityManager) {
        ReportingSearchCriteria criteria = ReportingSearchCriteria.builder()
                .accountType(AccountType.ORGANISATION)
                .phase(Phase.PHASE_3)
                .build();
        return progressUpdate1CustomRepository.findAll(entityManager, criteria);
    }

}
