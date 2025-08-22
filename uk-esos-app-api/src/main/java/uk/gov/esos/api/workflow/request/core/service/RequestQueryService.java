package uk.gov.esos.api.workflow.request.core.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestPayloadCascadable;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestDetailsSearchResults;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestSearchCriteria;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.repository.RequestDetailsRepository;
import uk.gov.esos.api.workflow.request.core.repository.RequestRepository;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static uk.gov.esos.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Validated
@Service
@RequiredArgsConstructor
public class RequestQueryService {

    private final RequestRepository requestRepository;
    private final RequestDetailsRepository requestDetailsRepository;
    
    @Transactional(readOnly = true)
    public List<Request> findInProgressRequestsByAccount(Long accountId){
        return requestRepository.findByAccountIdAndStatus(accountId, RequestStatus.IN_PROGRESS);
    }

    public boolean existsRequestById(String requestId){
        return requestRepository.existsById(requestId);
    }

    public boolean existsRequestByAccountAndType(Long accountId, RequestType requestType){
        return requestRepository.existsByAccountIdAndType(accountId, requestType);
    }
    
    public boolean existByRequestTypeAndRequestStatusAndCompetentAuthority(RequestType type, RequestStatus status, CompetentAuthorityEnum competentAuthority) {
        return requestRepository.existsByTypeAndStatusAndCompetentAuthority(type, status, competentAuthority);
    }

    public RequestDetailsSearchResults findRequestDetailsBySearchCriteria(@Valid RequestSearchCriteria criteria) {
        return requestDetailsRepository.findRequestDetailsBySearchCriteria(criteria);
    }

    public RequestDetailsDTO findRequestDetailsById(String requestId) {
    	return requestDetailsRepository.findRequestDetailsById(requestId)
    				.orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND, requestId));
    }

    public RequestDetailsDTO findRequestDetailsByIdAndAccountId(String requestId, long accountId) {
        return requestDetailsRepository.findRequestDetailsByIdAndAccountId(requestId, accountId)
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND, requestId));
    }

    public List<Request> getRelatedRequests(final List<Request> requests) {

        final Set<String> relatedRequestIds = requests.stream()
            .filter(request -> RequestType.getCascadableRequestTypes().contains(request.getType()))
            .map(Request::getPayload)
            .map(RequestPayloadCascadable.class::cast)
            .map(RequestPayloadCascadable::getRelatedRequestId)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

        return requestRepository.findByIdInAndStatus(relatedRequestIds, RequestStatus.IN_PROGRESS);
    }

    public boolean existsRequestByAccountAndTypeAndStatus(Long accountId, RequestType type, RequestStatus status){
        return requestRepository.existsByAccountIdAndTypeAndStatus(accountId, type, status);
    }

    public Request findByAccountAndType(Long accountId, RequestType type){
        return requestRepository.findByAccountIdAndType(accountId, type).orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
    }

}
