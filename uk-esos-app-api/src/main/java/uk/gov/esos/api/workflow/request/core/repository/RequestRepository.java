package uk.gov.esos.api.workflow.request.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface RequestRepository extends JpaRepository<Request, String> {

    @Override
    Optional<Request> findById(String id);

    @Transactional(readOnly = true)
    List<Request> findByAccountIdAndStatus(Long accountId, RequestStatus status);

    @Transactional(readOnly = true)
    List<Request> findByIdInAndStatus(Set<String> requestIds, RequestStatus status);
    
    @Transactional(readOnly = true)
    List<Request> findAllByAccountId(Long accountId);

    @Transactional(readOnly = true)
    List<Request> findAllByAccountIdIn(Set<Long> accountIds);
    
    @Transactional(readOnly = true)
    boolean existsByTypeAndStatusAndCompetentAuthority(RequestType type, RequestStatus status, CompetentAuthorityEnum competentAuthority);

    @Transactional(readOnly = true)
    boolean existsByAccountIdAndType(Long accountId, RequestType type);

    @Transactional(readOnly = true)
    boolean existsByAccountIdAndTypeAndStatus(Long accountId, RequestType type, RequestStatus status);

    @Transactional(readOnly = true)
    Optional<Request> findByAccountIdAndType(Long accountId, RequestType type);

}
