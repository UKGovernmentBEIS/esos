package uk.gov.esos.api.workflow.request.application.authorization;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.competentauthority.CompetentAuthorityEnum.ENGLAND;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.RequestAuthorityInfoDTO;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.ResourceAuthorityInfo;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.repository.RequestNoteRepository;

@ExtendWith(MockitoExtension.class)
class RequestNoteAuthorityInfoQueryServiceTest {

    @InjectMocks
    private RequestNoteAuthorityInfoQueryService service;

    @Mock
    private RequestNoteRepository requestNoteRepository;

    @Test
    void getRequestInfo() {

        final long noteId = 1L;
        final long accountId = 2L;
        final RoleType roleType = RoleType.REGULATOR;

        final Request request = Request.builder()
            .accountId(accountId)
            .competentAuthority(ENGLAND)
            .status(RequestStatus.IN_PROGRESS)
            .type(RequestType.ORGANISATION_ACCOUNT_OPENING)
            .build();

        when(requestNoteRepository.getRequestByNoteIdAndRoleType(noteId, roleType)).thenReturn(Optional.of(request));

        final RequestAuthorityInfoDTO requestInfoDTO = service.getRequestNoteInfo(noteId, roleType);

        final RequestAuthorityInfoDTO expectedRequestInfoDTO = RequestAuthorityInfoDTO.builder()
            .authorityInfo(ResourceAuthorityInfo.builder()
                .accountId(accountId)
                .competentAuthority(ENGLAND)
                .build())
            .build();
        assertEquals(expectedRequestInfoDTO, requestInfoDTO);
    }

    @Test
    void getRequestInfo_does_not_exist() {

        final long noteId = 1L;
        final RoleType roleType = RoleType.REGULATOR;
        when(requestNoteRepository.getRequestByNoteIdAndRoleType(noteId, roleType)).thenReturn(Optional.empty());

        BusinessException be = assertThrows(BusinessException.class, () -> service.getRequestNoteInfo(noteId, roleType));
        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
    }
}
