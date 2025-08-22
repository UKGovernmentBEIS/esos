package uk.gov.esos.api.mireport.common;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.mireport.common.domain.MiReportEntity;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportSearchResult;

import java.util.List;

@Repository
public interface MiReportRepository extends JpaRepository<MiReportEntity, Integer> {

    @Transactional(readOnly = true)
    List<MiReportSearchResult> findByCompetentAuthorityAndAccountType(CompetentAuthorityEnum competentAuthority, AccountType accountType);
}
