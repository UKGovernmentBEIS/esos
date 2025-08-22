package uk.gov.esos.api.authorization.core.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.authorization.core.domain.Authority;
import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityRoleDTO;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority, Long>, AuthorityCustomRepository {

    @Transactional(readOnly = true)
    @EntityGraph(value = "authority-permissions-graph", type = EntityGraph.EntityGraphType.FETCH)
    List<Authority> findByUserId(String userId);

    @Transactional(readOnly = true)
    List<Authority> findAllByUserIdInAndVerificationBodyId(Set<String> userIds, Long verificationBodyId);

    @Transactional(readOnly = true)
    @EntityGraph(value = "authority-permissions-graph", type = EntityGraph.EntityGraphType.FETCH)
    List<Authority> findByUserIdAndStatus(String userId, AuthorityStatus status);

    @Transactional(readOnly = true)
    @EntityGraph(value = "authority-permissions-graph", type = EntityGraph.EntityGraphType.FETCH)
    Optional<Authority> findByUserIdAndCompetentAuthority(String regulatorUserId, CompetentAuthorityEnum ca);
    
    @Transactional(readOnly = true)
    @EntityGraph(value = "authority-permissions-graph", type = EntityGraph.EntityGraphType.FETCH)
    Optional<Authority> findByUserIdAndAccountId(String operatorUserId, Long accountId);
    
    @Transactional(readOnly = true)
    @EntityGraph(value = "authority-permissions-graph", type = EntityGraph.EntityGraphType.FETCH)
    Optional<Authority> findByUserIdAndVerificationBodyId(String verifierUserId, Long verificationBodyId);
    
    @Transactional(readOnly = true)
    @Query(name =  Authority.NAMED_QUERY_FIND_OPERATOR_USER_AUTHORITY_ROLE_LIST_BY_ACCOUNT)
    List<AuthorityRoleDTO> findOperatorUserAuthorityRoleListByAccount(Long accountId);
    
    @Transactional(readOnly = true)
    @Query(name =  Authority.NAMED_QUERY_FIND_VERIFIER_USER_AUTHORITY_ROLE_LIST_BY_VERIFICATION_BODY)
    List<AuthorityRoleDTO> findVerifierUserAuthorityRoleListByVerificationBody(Long verificationBodyId);
    
    @Transactional(readOnly = true)
    @Query(name = Authority.NAMED_QUERY_FIND_ACTIVE_OPERATOR_USERS_BY_ACCOUNT_AND_ROLE)
    List<String> findActiveOperatorUsersByAccountAndRoleCode(Long accountId, String roleCode);
    
    @Transactional(readOnly = true)
    @Query(name =  Authority.NAMED_QUERY_FIND_USERS_BY_VERIFICATION_BODY_AND_ROLE_CODE)
    List<String> findUsersByVerificationBodyAndCode(Long verificationBodyId, String roleCode);
    
    @Transactional(readOnly = true)
    @Query(name =  Authority.NAMED_QUERY_FIND_ASSIGNED_PERMISSIONS_BY_USER_ID)
    List<Permission> findAssignedPermissionsByUserId(@Param("userId") String userId);
    
    @Transactional(readOnly = true)
    boolean existsByUserIdAndCompetentAuthority(String userId, CompetentAuthorityEnum competentAuthority);

    @Transactional(readOnly = true)
    boolean existsByUserIdAndVerificationBodyId(String userId, Long verificationBodyId);
    
    @Transactional(readOnly = true)
    boolean existsByUserId(String userId);
    
    void deleteByUserId(String userId);

    @Transactional(readOnly = true)
    @Query(name =  Authority.NAMED_QUERY_EXISTS_OTHER_ACCOUNT_OPERATOR_ADMIN)
    boolean existsOtherAccountOperatorAdmin(String userId, Long accountId);

    @Transactional(readOnly = true)
    @Query(name =  Authority.NAMED_QUERY_EXISTS_OTHER_VERIFICATION_BODY_ADMIN)
    boolean existsOtherVerificationBodyAdmin(String userId, Long verificationBodyId);

    @Transactional(readOnly = true)
    List<Authority> findByAccountIdAndCodeIn(Long accountId, List<String> codes);

    @Transactional(readOnly = true)
    @Query(name =  Authority.NAMED_QUERY_FIND_REGULATOR_USERS_WITH_SCOPE_ON_RESOURCE_TYPE_AND_SUB_TYPE_AND_CA)
    List<String> findRegulatorUsersWithScopeOnResourceTypeAndResourceSubTypeAndCA(
            ResourceType resourceType, String resourceSubType, Scope scope, CompetentAuthorityEnum competentAuthority);
    
    @Transactional(readOnly = true)
    @Query(name =  Authority.NAMED_QUERY_FIND_VERIFIER_USERS_WITH_SCOPE_ON_RESOURCE_TYPE_AND_SUB_TYPE_AND_VB_ID)
    List<String> findVerifierUsersWithScopeOnResourceTypeAndResourceSubTypeAndVerificationBodyId(
            ResourceType resourceType, String resourceSubType, Scope scope, Long verificationBodyId);
    
    @Transactional(readOnly = true)
    @Query(name =  Authority.NAMED_QUERY_FIND_OPERATOR_USERS_WITH_SCOPE_ON_RESOURCE_TYPE_AND_SUB_TYPE_AND_ACCOUNT_ID)
    List<String> findOperatorUsersWithScopeOnResourceTypeAndResourceSubTypeAndAccountId(
            ResourceType resourceType, String resourceSubType, Scope scope, Long accountId);

    @Transactional(readOnly = true)
    Optional<Authority> findByUuidAndStatus(String uuid, AuthorityStatus status);

    @Transactional(readOnly = true)
    List<Authority> findByCompetentAuthority(CompetentAuthorityEnum competentAuthority);

    @Transactional(readOnly = true)
    List<Authority> findByCompetentAuthorityAndStatusNot(CompetentAuthorityEnum competentAuthority, AuthorityStatus status);

    @Transactional(readOnly = true)
    @Query(name =  Authority.NAMED_QUERY_FIND_NON_PENDING_OPERATOR_USER_AUTHORITY_ROLE_LIST_BY_ACCOUNT)
    List<AuthorityRoleDTO> findNonPendingOperatorUserAuthorityRoleListByAccount(Long accountId);

    @Transactional(readOnly = true)
    @Query(name =  Authority.NAMED_QUERY_FIND_NON_PENDING_VERIFIER_USER_AUTHORITY_ROLE_LIST_BY_VERIFICATION_BODY)
    List<AuthorityRoleDTO> findNonPendingVerifierUserAuthorityRoleListByVerificationBody(Long verificationBodyId);

    @Transactional(readOnly = true)
    List<Authority> findAllByVerificationBodyIdInAndStatusIn(Set<Long> verificationBodyIds, Set<AuthorityStatus> status);

    @Transactional(readOnly = true)
    List<Authority> findAllByVerificationBodyId(Long verificationBodyId);
    
    @Transactional(readOnly = true)
    Optional<Authority> findByUserIdAndVerificationBodyIdNotNull(String verifierUserId);

    @Transactional(readOnly = true)
    List<Authority> findByAccountIdIn(List<Long> accountIds);

}
