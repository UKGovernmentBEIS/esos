package uk.gov.esos.api.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.hibernate.LazyInitializationException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.transaction.TestTransaction;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.account.repository.AccountRepository;
import uk.gov.esos.api.authorization.core.domain.Role;
import uk.gov.esos.api.authorization.core.repository.RoleRepository;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestAction;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.repository.RequestActionRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import(ObjectMapper.class)
class LazyInitializationIT extends AbstractContainerBaseTest {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private RequestActionRepository requestActionRepository;


    @Test
    void testLazyInitialization_whenLazyOneToManyAccessedAfterSessionCloses_thenThrowException() {

        final Role role = new Role();
        role.setName("roleName");
        role.setCode("roleCode");
        role.setType(RoleType.OPERATOR);
        role.setRolePermissions(new ArrayList<>());

        entityManager.persist(role);
        entityManager.flush();
        entityManager.clear();

        final List<Role> roles = roleRepository.findAll();

        TestTransaction.end();

        assertEquals(1, roles.size());
        assertThrows(LazyInitializationException.class, () -> roles.get(0).getRolePermissions());
    }

    @Test
    void testLazyInitialization_whenLazyBasicAccessedAfterSessionCloses_thenThrowException() {

        Request request = Request.builder()
            .id("1")
            .type(RequestType.ORGANISATION_ACCOUNT_OPENING)
            .status(RequestStatus.IN_PROGRESS)
            .creationDate(LocalDateTime.now())
            .build();

        RequestAction requestAction = RequestAction.builder()
            .request(request)
            .type(RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED)
            .submitterId("userId")
            .submitter("username")
            .creationDate(LocalDateTime.now())
            .build();

        entityManager.persist(request);
        entityManager.persist(requestAction);

        entityManager.flush();
        entityManager.clear();

        final List<RequestAction> requestActions = requestActionRepository.findAll();

        TestTransaction.end();

        assertEquals(1, requestActions.size());
        assertThrows(LazyInitializationException.class, () -> requestActions.get(0).getPayload());
    }
}
