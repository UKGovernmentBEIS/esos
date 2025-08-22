package uk.gov.esos.api.workflow.request.application.authorization;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.RequestAuthorityInfoDTO;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.ResourceAuthorityInfo;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.providers.RequestNoteAuthorityInfoProvider;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.repository.RequestNoteRepository;

@RequiredArgsConstructor
@Service
public class RequestNoteAuthorityInfoQueryService implements RequestNoteAuthorityInfoProvider {

    private final RequestNoteRepository requestNoteRepository;

    @Override
    public RequestAuthorityInfoDTO getRequestNoteInfo(final Long id, final RoleType roleType) {

        final Request request = requestNoteRepository.getRequestByNoteIdAndRoleType(id, roleType)
            .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
        
        return RequestAuthorityInfoDTO.builder()
            .authorityInfo(ResourceAuthorityInfo.builder()
                .accountId(request.getAccountId())
                .competentAuthority(request.getCompetentAuthority())
                .verificationBodyId(request.getVerificationBodyId()).build())
            .build();
    }
}
