package uk.gov.esos.api.authorization.core.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.EntityManager;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.jdbc.Sql;
import org.testcontainers.junit.jupiter.Testcontainers;

import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.authorization.core.domain.Authority;
import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.core.domain.UserRoleType;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import(ObjectMapper.class)
class UserRoleTypeRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private UserRoleTypeRepository userRoleTypeRepository;
    
    @Autowired
	private EntityManager entityManager;

    
    @Test
    void findById_operator_role() {
    	final String userId = "user_operator_id";
    	createAuthority(userId, "operator_admin", AuthorityStatus.ACTIVE, 1L, null, null);
    	createAuthority(userId, "operator_user", AuthorityStatus.ACTIVE, 2L, null, null);
    	flushAndClear();

    	Optional<UserRoleType> optionalUserRole = userRoleTypeRepository.findById(userId);

        assertTrue(optionalUserRole.isPresent());
        assertEquals(RoleType.OPERATOR, optionalUserRole.get().getRoleType());
        assertEquals(userId, optionalUserRole.get().getUserId());
    }

    @Test
    void findById_verifier_role() {
    	final String userId = "verifier_user_id";
    	createAuthority(userId, "verifier_user", AuthorityStatus.ACTIVE, null, null, 1L);
    	flushAndClear();
    	
        Optional<UserRoleType> optionalUserRole = userRoleTypeRepository.findById(userId);

        assertTrue(optionalUserRole.isPresent());
        assertEquals(RoleType.VERIFIER, optionalUserRole.get().getRoleType());
        assertEquals(userId, optionalUserRole.get().getUserId());
    }
    
    @Test
    void findById_regulator_role() {
    	final String userId = "reulator_user_id";
    	createAuthority(userId, "regulator_user", AuthorityStatus.ACTIVE, null, CompetentAuthorityEnum.ENGLAND, null);
    	flushAndClear();
    	
        Optional<UserRoleType> optionalUserRole = userRoleTypeRepository.findById(userId);

        assertTrue(optionalUserRole.isPresent());
        assertEquals(RoleType.REGULATOR, optionalUserRole.get().getRoleType());
        assertEquals(userId, optionalUserRole.get().getUserId());
    }

    @Sql(statements = {
        "INSERT INTO au_authority (id, user_id, code, status, account_id, competent_authority, creation_date, created_by) VALUES (3, 'user_regulator_id_a', 'regulator_user', 'PENDING', null, 'ENGLAND', NOW(), 'user_regulator_id_a')",
        "INSERT INTO au_authority (id, user_id, code, status, account_id, competent_authority, creation_date, created_by) VALUES (4, 'user_regulator_id_b', 'regulator_user', 'DISABLED', null, 'WALES', NOW(), 'user_regulator_id_b')"
    })
    
    void findById_throws_exception_when_multiple_roles_exist() {
    	final String userId = "user_operator_id";
    	createAuthority(userId, "operator_admin", AuthorityStatus.ACTIVE, 1L, null, null);
    	createAuthority(userId, "verifier_admin", AuthorityStatus.ACTIVE, null, null, 1L);
    	flushAndClear();

    	Exception e = assertThrows(Exception.class, () -> userRoleTypeRepository.findById(userId));
    	assertThat(e.getClass()).isEqualTo(JpaSystemException.class);
    }
    
    private Authority createAuthority(String userId, String code, AuthorityStatus authorityStatus, 
			Long accountId, 
			CompetentAuthorityEnum ca,
			Long verificationBodyId) {
		Authority authority = Authority.builder()
            .userId(userId)
            .code(code)
            .status(authorityStatus)
            .accountId(accountId)
            .competentAuthority(ca)
            .verificationBodyId(verificationBodyId)
            .createdBy(userId)
            .build();

		entityManager.persist(authority);
		return authority;
	}
	
	private void flushAndClear() {
		entityManager.flush();
		entityManager.clear();
	}

}