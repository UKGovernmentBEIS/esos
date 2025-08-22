package uk.gov.esos.api.workflow.request.core.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestDetailsSearchResults;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestSearchCriteria;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.repository.RequestDetailsRepository;
import uk.gov.esos.api.workflow.request.core.repository.RequestRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestQueryServiceTest {

    @InjectMocks
    private RequestQueryService service;

    @Mock
    private RequestRepository requestRepository;

    @Mock
    private RequestDetailsRepository requestDetailsRepository;
    
    @Test
    void findInProgressRequestsByAccount() {
        Long accountId = 1L;
        Request request = Request.builder().id("1").status(RequestStatus.IN_PROGRESS).build();

        when(requestRepository.findByAccountIdAndStatus(accountId, RequestStatus.IN_PROGRESS)).thenReturn(List.of(request));
        
        List<Request> result = service.findInProgressRequestsByAccount(accountId);
        
        assertThat(result).containsExactlyInAnyOrder(request);
        verify(requestRepository, times(1)).findByAccountIdAndStatus(accountId, RequestStatus.IN_PROGRESS);
    }

    @Test
    void existsRequestById() {
        String requestId = "requestId";

        when(requestRepository.existsById(requestId)).thenReturn(true);

        boolean result = service.existsRequestById(requestId);

        assertThat(result).isTrue();
        verify(requestRepository, times(1)).existsById(requestId);
    }

    @Test
    void existsRequestByAccountAndType() {
        final long accountId = 1L;
        final RequestType requestType = RequestType.NOTIFICATION_OF_COMPLIANCE_P3;

        when(requestRepository.existsByAccountIdAndType(accountId, requestType)).thenReturn(true);

        boolean result = service.existsRequestByAccountAndType(accountId, requestType);

        assertThat(result).isTrue();
        verify(requestRepository, times(1)).existsByAccountIdAndType(accountId, requestType);
    }
    
    @Test
    void existByRequestTypeAndRequestStatusAndCompetentAuthority() {
    	RequestType type = RequestType.ORGANISATION_ACCOUNT_OPENING;
    	RequestStatus status = RequestStatus.IN_PROGRESS;
    	CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;

        when(requestRepository.existsByTypeAndStatusAndCompetentAuthority(type, status, competentAuthority)).thenReturn(true);

        boolean result = service.existByRequestTypeAndRequestStatusAndCompetentAuthority(type, status, competentAuthority);

        assertThat(result).isTrue();
        verify(requestRepository, times(1)).existsByTypeAndStatusAndCompetentAuthority(type, status, competentAuthority);
    }

    @Test
    void findRequestDetailsBySearchCriteria() {
        Long accountId = 1L;
        final String requestId = "1";
        RequestSearchCriteria criteria = RequestSearchCriteria.builder().accountId(accountId)
        		.paging(PagingRequest.builder().pageNumber(0L).pageSize(30L).build()).build();

        RequestDetailsDTO workflowResult1 = new RequestDetailsDTO(requestId, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS, LocalDateTime.now(), null);
        RequestDetailsDTO workflowResult2 = new RequestDetailsDTO(requestId, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS, LocalDateTime.now(), null);

        RequestDetailsSearchResults expectedResults = RequestDetailsSearchResults.builder()
                .requestDetails(List.of(workflowResult1, workflowResult2))
                .total(10L)
                .build();

        when(requestDetailsRepository.findRequestDetailsBySearchCriteria(criteria)).thenReturn(expectedResults);

        RequestDetailsSearchResults actualResults = service.findRequestDetailsBySearchCriteria(criteria);

        assertThat(actualResults).isEqualTo(expectedResults);
        verify(requestDetailsRepository, times(1)).findRequestDetailsBySearchCriteria(criteria);
    }

    @Test
    void findRequestDetailsById() {
        final String requestId = "1";
        RequestDetailsDTO expected = new RequestDetailsDTO(requestId, RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS, LocalDateTime.now(), null);

        when(requestDetailsRepository.findRequestDetailsById(requestId)).thenReturn(Optional.of(expected));

        RequestDetailsDTO actual = service.findRequestDetailsById(requestId);

        assertThat(actual).isEqualTo(expected);
        verify(requestDetailsRepository, times(1)).findRequestDetailsById(requestId);
    }
    
    @Test
    void findRequestDetailsById_not_found() {
        final String requestId = "1";

        when(requestDetailsRepository.findRequestDetailsById(requestId)).thenReturn(Optional.empty());

        BusinessException be = assertThrows(BusinessException.class, () -> service.findRequestDetailsById(requestId));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
        verify(requestDetailsRepository, times(1)).findRequestDetailsById(requestId);
    }

    @Test
    void findRequestDetailsByIdAndAccountId() {
        final String requestId = "1";
        final long accountId = 1L;
        RequestDetailsDTO expected = new RequestDetailsDTO(requestId, RequestType.ORGANISATION_ACCOUNT_OPENING,
                RequestStatus.IN_PROGRESS, LocalDateTime.now(), null);

        when(requestDetailsRepository.findRequestDetailsByIdAndAccountId(requestId, accountId))
                .thenReturn(Optional.of(expected));

        // Invoke
        RequestDetailsDTO actual = service.findRequestDetailsByIdAndAccountId(requestId, accountId);

        // Verify
        assertThat(actual).isEqualTo(expected);
        verify(requestDetailsRepository, times(1))
                .findRequestDetailsByIdAndAccountId(requestId, accountId);
    }

    @Test
    void findRequestDetailsByIdAndAccountId_not_found() {
        final String requestId = "1";
        final long accountId = 1L;

        when(requestDetailsRepository.findRequestDetailsByIdAndAccountId(requestId, accountId))
                .thenReturn(Optional.empty());

        // Invoke
        BusinessException be = assertThrows(BusinessException.class, () ->
                service.findRequestDetailsByIdAndAccountId(requestId, accountId));

        // Verify
        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
        verify(requestDetailsRepository, times(1))
                .findRequestDetailsByIdAndAccountId(requestId, accountId);
    }

    @Test
    void existsByAccountIdAndTypeAndStatus(){
        Long accountId = 1L;
        RequestType type = RequestType.PROGRESS_UPDATE_1_P3;
        RequestStatus status = RequestStatus.COMPLETED;
        boolean expectedResult = true;

        when(requestRepository.existsByAccountIdAndTypeAndStatus(accountId, type, status))
                .thenReturn(expectedResult);

        boolean result = requestRepository.existsByAccountIdAndTypeAndStatus(accountId, type, status);

        Assertions.assertEquals(expectedResult, result);
        verify(requestRepository, times(1)).existsByAccountIdAndTypeAndStatus(accountId, type, status);
    }

    @Test
    void findByAccountAndType(){
        Long accountId = 1L;
        RequestType type = RequestType.ACTION_PLAN_P3;
        Request expected = Request.builder().id("1").status(RequestStatus.IN_PROGRESS).build();

        when(requestRepository.findByAccountIdAndType(accountId, type))
                .thenReturn(Optional.ofNullable(expected));

        Request actual = service.findByAccountAndType(accountId, type);
        Assertions.assertEquals(expected, actual);
        verify(requestRepository, times(1)).findByAccountIdAndType(accountId, type);
    }
}
