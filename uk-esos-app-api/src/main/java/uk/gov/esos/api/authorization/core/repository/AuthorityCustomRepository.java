package uk.gov.esos.api.authorization.core.repository;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.transaction.annotation.Transactional;

import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

public interface AuthorityCustomRepository {

    @Transactional(readOnly = true)
    Map<Long, Set<String>> findResourceSubTypesOperatorUserHasScopeByAccounts(String userId, Set<Long> accounts,
                                                                              ResourceType resourceType, Scope scope);

	@Transactional(readOnly = true)
    Map<CompetentAuthorityEnum, Set<String>> findResourceSubTypesRegulatorUserHasScope(String userId, ResourceType resourceType, Scope scope);

    @Transactional(readOnly = true)
    Map<Long, Set<String>> findResourceSubTypesVerifierUserHasScope(String userId, ResourceType resourceType, Scope scope);
	
	@Transactional(readOnly = true)
    List<String> findOperatorUsersByAccountId(Long accountId);
	
	@Transactional(readOnly = true)
    List<String> findRegulatorUsersByCompetentAuthority(CompetentAuthorityEnum competentAuthority);
	
	@Transactional(readOnly = true)
    List<String> findVerifierUsersByVerificationBodyId(Long verificationBodyId);

    @Transactional(readOnly = true)
    Map<String, AuthorityStatus> findStatusByUsers(List<String> userIds);
    
    @Transactional(readOnly = true)
    Map<String, AuthorityStatus> findStatusByUsersAndAccountId(List<String> userIds, Long accountId);
    
    @Transactional(readOnly = true)
    Map<String, AuthorityStatus> findStatusByUsersAndCA(List<String> userIds, CompetentAuthorityEnum competentAuthority);
}
