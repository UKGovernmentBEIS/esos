package uk.gov.esos.api.mireport.common.progressupdate1submitteddata;

import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;

public interface ProgressUpdate1CustomRepository {

    @Transactional(readOnly = true)
    ProgressUpdate1SearchResults findAll(EntityManager entityManager, ReportingSearchCriteria searchCriteria);
}
