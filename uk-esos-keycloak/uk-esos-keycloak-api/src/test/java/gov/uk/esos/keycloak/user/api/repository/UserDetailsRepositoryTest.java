package gov.uk.esos.keycloak.user.api.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;
import java.util.UUID;

import gov.uk.esos.keycloak.user.api.AbstractContainerBaseTest;
import gov.uk.esos.keycloak.user.api.model.jpa.Signature;
import gov.uk.esos.keycloak.user.api.model.jpa.UserDetails;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.keycloak.models.jpa.entities.UserEntity;

import gov.uk.esos.keycloak.user.api.model.SignatureDTO;
import gov.uk.esos.keycloak.user.api.model.UserDetailsRequestDTO;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;

public class UserDetailsRepositoryTest extends AbstractContainerBaseTest {

    private static EntityManagerFactory entityManagerFactory;
    private static EntityManager entityManager;
    private UserDetailsRepository repository;

    @BeforeAll
    public static void init() {
        entityManagerFactory = Persistence.createEntityManagerFactory("uk-esos");
    }

    @BeforeEach
    public void setup() {
        entityManager = entityManagerFactory.createEntityManager();
        repository = new UserDetailsRepository(entityManager);
    }

    @AfterEach
    public void close() {
        entityManager.clear();
        entityManager.close();
    }

    @Test
    void findUserDetails() {
        entityManager.getTransaction().begin();

        String userId = UUID.randomUUID().toString();
        UserEntity userEntity = new UserEntity();
        userEntity.setId(userId);
        userEntity.setFirstName("fn");
        userEntity.setLastName("ln");
        entityManager.persist(userEntity);
        
        String signatureUuid = UUID.randomUUID().toString();
        Signature signature = new Signature(signatureUuid, "content".getBytes(), "fileName", 1L, "type");
        UserDetails userDetails = new UserDetails();
        userDetails.setUser(userEntity);
        userDetails.setSignature(signature);
        
        entityManager.persist(userDetails);
        flushAndClear();
        
        entityManager.getTransaction().commit();
        
        Optional<UserDetails> resultOpt = repository.findUserDetails(userId);
        assertThat(resultOpt).isNotEmpty();
        assertThat(resultOpt.get().getId()).isEqualTo(userId);
        assertThat(resultOpt.get().getSignature()).isEqualTo(signature);
    }
    
    @Test
    void findUserDetails_not_found() {
        entityManager.getTransaction().begin();

        String userId = UUID.randomUUID().toString();
        UserEntity userEntity = new UserEntity();
        userEntity.setId(userId);
        userEntity.setFirstName("fn");
        userEntity.setLastName("ln");
        entityManager.persist(userEntity);
        flushAndClear();
        
        entityManager.getTransaction().commit();
        
        Optional<UserDetails> resultOpt = repository.findUserDetails(userId);
        assertThat(resultOpt).isEmpty();
    }
    
    @Test
    void saveUserDetails_persist_with_signature() {
        entityManager.getTransaction().begin();
        String userId = UUID.randomUUID().toString();
        UserEntity userEntity = new UserEntity();
        userEntity.setId(userId);
        userEntity.setFirstName("fn");
        userEntity.setLastName("ln");
        entityManager.persist(userEntity);
        flushAndClear();
        entityManager.getTransaction().commit();
        
        Optional<UserDetails> resultOpt = repository.findUserDetails(userId);
        assertThat(resultOpt).isEmpty();
        
        entityManager.getTransaction().begin();
        SignatureDTO signatureDTO = new SignatureDTO("content".getBytes(), "fileName", 1L, "type");
        UserDetailsRequestDTO userDetailsRequest = new UserDetailsRequestDTO(userId, signatureDTO);
        repository.saveUserDetails(userDetailsRequest);
        flushAndClear();
        entityManager.getTransaction().commit();
        
        //verify
        resultOpt = repository.findUserDetails(userId);
        assertThat(resultOpt).isNotEmpty();
        assertThat(resultOpt.get().getId()).isEqualTo(userId);
        assertThat(resultOpt.get().getSignature().getSignatureName()).isEqualTo("fileName");
        assertThat(resultOpt.get().getSignature().getSignatureSize()).isEqualTo(1L);
        assertThat(resultOpt.get().getSignature().getSignatureType()).isEqualTo("type");
        assertArrayEquals(resultOpt.get().getSignature().getSignatureContent(), "content".getBytes());
    }
    
    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }
}
