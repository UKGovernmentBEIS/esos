package uk.gov.esos.api.mireport.common.actionplansubmitteddata;

import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;

public interface ActionPlanCustomRepository {

    @Transactional(readOnly = true)
    ActionPlanSearchResults findAll(EntityManager entityManager, ReportingSearchCriteria searchCriteria);
}
