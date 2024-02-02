package uk.gov.esos.api.workflow.request.application.authorization;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.RequestActionAuthorityInfoDTO;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.ResourceAuthorityInfo;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.providers.RequestActionAuthorityInfoProvider;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.repository.RequestActionRepository;

@Service
@RequiredArgsConstructor
public class RequestActionAuthorityInfoQueryService implements RequestActionAuthorityInfoProvider {

    private final RequestActionRepository requestActionRepository;

    @Override
    @Transactional(readOnly = true)
    public RequestActionAuthorityInfoDTO getRequestActionAuthorityInfo(Long requestActionId) {
        return requestActionRepository.findById(requestActionId)
                .map(requestAction -> RequestActionAuthorityInfoDTO.builder()
                        .id(requestAction.getId())
                        .type(requestAction.getType().name())
                        .authorityInfo(ResourceAuthorityInfo.builder()
                                .accountId(requestAction.getRequest().getAccountId())
                                .competentAuthority(requestAction.getRequest().getCompetentAuthority())
                                .verificationBodyId(requestAction.getRequest().getVerificationBodyId()).build())
                        .build())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }
}
