package uk.gov.esos.api.reporting.actionplan.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanEntity;

import java.util.Optional;

@Repository
public interface ActionPlanRepository extends JpaRepository<ActionPlanEntity, String> {

    Optional<ActionPlanEntity> findByAccountId(Long accountId);

}
