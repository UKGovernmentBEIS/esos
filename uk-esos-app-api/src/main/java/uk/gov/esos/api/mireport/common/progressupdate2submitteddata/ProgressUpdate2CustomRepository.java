package uk.gov.esos.api.mireport.common.progressupdate2submitteddata;

import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;

public interface ProgressUpdate2CustomRepository {

    @Transactional(readOnly = true)
    ProgressUpdate2SearchResults findAll(EntityManager entityManager, ReportingSearchCriteria searchCriteria);
}
