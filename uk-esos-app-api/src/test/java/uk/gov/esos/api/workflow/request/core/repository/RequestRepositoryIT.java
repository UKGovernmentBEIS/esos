package uk.gov.esos.api.workflow.request.core.repository;

import jakarta.persistence.EntityManager;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.shaded.org.bouncycastle.cert.ocsp.Req;
import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestMetadata;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
class RequestRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private RequestRepository requestRepository;
    
    @Autowired
	private EntityManager entityManager;
    
    @Test
    void findByAccountIdAndStatus() {
        Long accountId = 1L;
        Request request = createRequest(accountId, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS, null);
        createRequest(accountId, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.CANCELLED, null);

        flushAndClear();
        
        List<Request> result = requestRepository.findByAccountIdAndStatus(accountId, RequestStatus.IN_PROGRESS);
        
        assertThat(result).containsExactlyInAnyOrder(request);
    }

    @Test
    void findAllByAccountId() {
        Long accountId1 = 1L;
        Long accountId2 = 2L;

        Request acc1Request = createRequest(accountId1, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS, null);
        createRequest(accountId2, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS, null);

        flushAndClear();

        List<Request> retrievedRequests = requestRepository.findAllByAccountId(accountId1);

        assertThat(retrievedRequests).hasSize(1);
        assertThat(retrievedRequests)
            .extracting(Request::getId)
            .containsExactly(acc1Request.getId());
    }

    @Test
    void findAllByAccountIdInAndStatusIn() {
        Long accountId1 = 1L;
        Long accountId2 = 2L;
        Long accountId3 = 3L;

        Request acc1Request = createRequest(accountId1, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.APPROVED, LocalDateTime.now());
        Request acc2Request = createRequest(accountId2, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS, null);
        createRequest(accountId3, CompetentAuthorityEnum.ENGLAND, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS, null);

        flushAndClear();

        List<Request> retrievedRequests = requestRepository.findAllByAccountIdIn(Set.of(accountId1, accountId2));

        assertThat(retrievedRequests).hasSize(2);
        assertThat(retrievedRequests)
            .extracting(Request::getId)
            .containsExactlyInAnyOrder(acc1Request.getId(), acc2Request.getId());
    }
    
    @Test
    void existsByTypeAndStatusAndCompetentAuthority_exists() {
    	RequestType type = RequestType.ORGANISATION_ACCOUNT_OPENING;
    	RequestStatus status= RequestStatus.IN_PROGRESS;
    	CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
    	
    	createRequest(1L, competentAuthority, type, status, LocalDateTime.now());
    	
        flushAndClear();
        
        boolean result = requestRepository.existsByTypeAndStatusAndCompetentAuthority(type, status, competentAuthority);
        
        assertThat(result).isTrue();
    }
    
    @Test
    void existsByTypeAndStatusAndCompetentAuthority_not_exist() {
    	RequestType type = RequestType.ORGANISATION_ACCOUNT_OPENING;
    	RequestStatus status= RequestStatus.IN_PROGRESS;
    	CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
    	
    	createRequest(1L, competentAuthority, type, RequestStatus.APPROVED, LocalDateTime.now());
        createRequest(2L, CompetentAuthorityEnum.OPRED, type, status, LocalDateTime.now());
        
        flushAndClear();
        
        boolean result = requestRepository.existsByTypeAndStatusAndCompetentAuthority(type, status, competentAuthority);
        
        assertThat(result).isFalse();
    }

    @Test
    void existsByAccountIdAndTypeAndStatus_exists() {
        RequestType type = RequestType.PROGRESS_UPDATE_1_P3;
        RequestStatus status= RequestStatus.COMPLETED;
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;

        createRequest(1L, competentAuthority, type, status, LocalDateTime.now());

        flushAndClear();

        boolean result = requestRepository.existsByAccountIdAndTypeAndStatus(1L,type, status);

        assertThat(result).isTrue();
    }

    @Test
    void existsByAccountIdAndTypeAndStatus_not_exists() {
        RequestType type = RequestType.ACTION_PLAN_P3;
        RequestStatus status= RequestStatus.IN_PROGRESS;
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;

        createRequest(2L, competentAuthority, type, status, LocalDateTime.now());

        boolean result = requestRepository.existsByAccountIdAndTypeAndStatus(1L,type, status);

        assertThat(result).isFalse();
    }

    @Test
    void findByAccountAndType() {
        RequestType type = RequestType.PROGRESS_UPDATE_1_P3;
        RequestStatus status= RequestStatus.COMPLETED;
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;

        Request request = createRequest(1L, competentAuthority, type, status, LocalDateTime.now());

        flushAndClear();

        Optional<Request> result = requestRepository.findByAccountIdAndType(1L,type);

        assertThat(result.isPresent()).isTrue();
        assertThat(result.get()).isEqualTo(request);
    }

    @Test
    void findByAccountAndType_not_found() {
        RequestType type = RequestType.PROGRESS_UPDATE_1_P3;
        RequestStatus status= RequestStatus.COMPLETED;
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;

        Request request = createRequest(2L, competentAuthority, type, status, LocalDateTime.now());

        flushAndClear();

        Optional<Request> result = requestRepository.findByAccountIdAndType(1L,type);

        assertThat(result.isPresent()).isFalse();
    }

    
	private Request createRequest(Long accountId, CompetentAuthorityEnum competentAuthority, RequestType type,
			RequestStatus status, LocalDateTime endDate) {
		return createRequest(accountId, competentAuthority, type, status, endDate, null);
	}
    
	private Request createRequest(Long accountId, CompetentAuthorityEnum competentAuthority, RequestType type,
			RequestStatus status, LocalDateTime endDate, Long verificationBodyId) {
		return createRequest(accountId, competentAuthority, type, status, endDate, verificationBodyId, null);
	}
    
	private Request createRequest(Long accountId, CompetentAuthorityEnum competentAuthority, RequestType type,
			RequestStatus status, LocalDateTime endDate, Long verificationBodyId, RequestMetadata metadata) {
        Request request = 
                Request.builder()
                    .id(RandomStringUtils.random(5))
                    .accountId(accountId)
                    .type(type)
                    .status(status)
                    .competentAuthority(competentAuthority)
                    .verificationBodyId(verificationBodyId)
                    .endDate(endDate)
                    .metadata(metadata)
                    .build();
        entityManager.persist(request);
        return request;
    }
    
    private void flushAndClear() {
		entityManager.flush();
		entityManager.clear();
	}

}
