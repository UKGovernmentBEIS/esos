package uk.gov.esos.api.workflow.request.application.item.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uk.gov.esos.api.workflow.request.application.item.domain.RequestTaskVisit;
import uk.gov.esos.api.workflow.request.application.item.domain.RequestTaskVisitPK;

@Repository
public interface RequestTaskVisitRepository extends JpaRepository<RequestTaskVisit, RequestTaskVisitPK> {

    void deleteByTaskId(Long taskId);
}
