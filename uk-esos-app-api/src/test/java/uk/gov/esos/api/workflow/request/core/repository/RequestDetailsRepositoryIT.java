package uk.gov.esos.api.workflow.request.core.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.EntityManager;
import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestMetadata;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestDetailsSearchResults;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestSearchCriteria;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestHistoryCategory;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import({ObjectMapper.class, RequestDetailsRepository.class})
class RequestDetailsRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private RequestDetailsRepository repo;

    @Autowired
    private EntityManager entityManager;
    
    @Test
    void findRequestDetailsBySearchCriteria_filter_with_category_and_request_types_criteria_only() {
        Long accountId = 1L;
        Request request1 = createRequest(accountId, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS, CompetentAuthorityEnum.ENGLAND);
        createRequest(accountId, RequestType.NOTIFICATION_OF_COMPLIANCE_P3, RequestStatus.COMPLETED, CompetentAuthorityEnum.ENGLAND);
        createRequest(2L, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS, CompetentAuthorityEnum.ENGLAND);

        flushAndClear();
        
        RequestSearchCriteria criteria = RequestSearchCriteria.builder()
                .accountId(accountId)
                .paging(PagingRequest.builder().pageNumber(0L).pageSize(30L).build())
                .category(RequestHistoryCategory.PERMIT)
                .requestTypes(Set.of(RequestType.ORGANISATION_ACCOUNT_OPENING))
                .build();
        
        RequestDetailsSearchResults results = repo.findRequestDetailsBySearchCriteria(criteria);
        
        RequestDetailsDTO expectedWorkflowResult1 = new RequestDetailsDTO(request1.getId(), request1.getType(), request1.getStatus(), request1.getCreationDate(), null);
        
        assertThat(results).isNotNull();
        assertThat(results.getTotal()).isEqualTo(1L);
        assertThat(results.getRequestDetails()).isEqualTo(List.of(expectedWorkflowResult1));
    }

    @Test
    void findRequestDetailsById() {
        Request request = createRequest(1L, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS, CompetentAuthorityEnum.ENGLAND);
        createRequest(1L, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.COMPLETED, CompetentAuthorityEnum.ENGLAND);
        flushAndClear();

        Optional<RequestDetailsDTO> actualOpt = repo.findRequestDetailsById(request.getId());

        assertThat(actualOpt).isNotEmpty();
        RequestDetailsDTO actual = actualOpt.get();
        assertThat(actual.getId()).isEqualTo(request.getId());
        assertThat(actual.getRequestType()).isEqualTo(request.getType());
        assertThat(actual.getRequestStatus()).isEqualTo(request.getStatus());
        assertThat(actual.getCreationDate()).isEqualTo(request.getCreationDate().toLocalDate());
    }
    
    @Test
    void findRequestDetailsById_not_found() {
        createRequest(1L, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.COMPLETED, CompetentAuthorityEnum.ENGLAND);
        flushAndClear();

        Optional<RequestDetailsDTO> actualOpt = repo.findRequestDetailsById("invalid_request_id");

        assertThat(actualOpt).isEmpty();
    }

    @Test
    void findRequestDetailsByIdAndAccountId() {
        long accountId = 1L;
        Request request = createRequest(1L, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS, CompetentAuthorityEnum.ENGLAND);
        createRequest(accountId, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.COMPLETED, CompetentAuthorityEnum.ENGLAND);
        flushAndClear();

        Optional<RequestDetailsDTO> actualOpt = repo.findRequestDetailsByIdAndAccountId(request.getId(), accountId);

        assertThat(actualOpt).isNotEmpty();
        RequestDetailsDTO actual = actualOpt.get();
        assertThat(actual.getId()).isEqualTo(request.getId());
        assertThat(actual.getRequestType()).isEqualTo(request.getType());
        assertThat(actual.getRequestStatus()).isEqualTo(request.getStatus());
        assertThat(actual.getCreationDate()).isEqualTo(request.getCreationDate().toLocalDate());
    }

    @Test
    void findRequestDetailsByIdAndAccountId_not_found() {
        long accountId = 1L;
        createRequest(1L, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS, CompetentAuthorityEnum.ENGLAND);
        Request request = createRequest(accountId, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.COMPLETED, CompetentAuthorityEnum.ENGLAND);
        flushAndClear();

        Optional<RequestDetailsDTO> actualOpt = repo.findRequestDetailsByIdAndAccountId(request.getId(), 2L);

        assertThat(actualOpt).isEmpty();
    }

    private Request createRequest(Long accountId, RequestType type, RequestStatus status, CompetentAuthorityEnum ca) {
        return createRequest(accountId, type, status, ca, null);
    }
    
    private Request createRequest(Long accountId, RequestType type, RequestStatus status, CompetentAuthorityEnum ca, RequestMetadata metaData) {
        Request request =
            Request.builder()
                    .id(RandomStringUtils.random(5))
                    .competentAuthority(ca)
                    .type(type)
                    .status(status)
                    .accountId(accountId)
                    .metadata(metaData)
                    .build();

        entityManager.persist(request);

        return request;
    }
    
    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }
}