package uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1Entity;

import java.util.Optional;

@Repository
public interface ProgressUpdate1Repository extends JpaRepository<ProgressUpdate1Entity, String> {

    Optional<ProgressUpdate1Entity> findByAccountId(Long accountId);

}
