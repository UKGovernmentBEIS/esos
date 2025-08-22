package uk.gov.esos.api.competentauthority.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.competentauthority.domain.CompetentAuthority;

public interface CompetentAuthorityRepository
		extends JpaRepository<CompetentAuthority, CompetentAuthorityEnum>, CompetentAuthorityCustomRepository {

}
