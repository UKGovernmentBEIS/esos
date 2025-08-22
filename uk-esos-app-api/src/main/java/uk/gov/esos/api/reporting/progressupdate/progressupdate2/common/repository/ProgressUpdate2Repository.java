package uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain.ProgressUpdate2Entity;

@Repository
public interface ProgressUpdate2Repository extends JpaRepository<ProgressUpdate2Entity, String> {
}
