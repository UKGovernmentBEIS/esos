package uk.gov.esos.api.workflowperiod.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.workflowperiod.domain.WorkFlowValidPeriod;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import java.util.Optional;

@Repository
public interface WorkFlowValidPeriodRepository  extends JpaRepository<WorkFlowValidPeriod, String> {

    @Override
    Optional<WorkFlowValidPeriod> findById(String id);

    @Transactional(readOnly = true)
    Optional<WorkFlowValidPeriod> findWorkFlowValidPeriodByType(RequestType type);


}
