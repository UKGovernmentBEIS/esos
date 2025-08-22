package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.workflow.request.StartProcessRequestService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestMetadataType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1RequestCreateActionPayload;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestMetadata;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestPayload;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate1P3SubmitApplicationCreateActionHandlerTest {

    @InjectMocks
    private ProgressUpdate1P3SubmitApplicationCreateActionHandler handler;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Test
    void process() {
        final String requestId = "PU100001-P3";
        final String userId = "userId";
        final AppUser appUser = AppUser.builder().userId(userId).build();
        final Long accountId = 1L;
        final ProgressUpdate1RequestCreateActionPayload createPayload = ProgressUpdate1RequestCreateActionPayload.builder().build();
        final RequestCreateActionType type = RequestCreateActionType.ACTION_PLAN_P3;

        final RequestParams requestParams = RequestParams.builder()
                .type(RequestType.PROGRESS_UPDATE_1_P3)
                .accountId(accountId)
                .requestPayload(ProgressUpdate1P3RequestPayload.builder()
                        .payloadType(RequestPayloadType.PROGRESS_UPDATE_1_P3_REQUEST_PAYLOAD)
                        .operatorAssignee(userId)
                        .build())
                .requestMetadata(ProgressUpdate1P3RequestMetadata.builder()
                        .type(RequestMetadataType.PROGRESS_UPDATE_1_P3)
                        .phase(Phase.PHASE_3)
                        .build())
                .build();

        when(startProcessRequestService.startProcess(requestParams))
                .thenReturn(Request.builder().id(requestId).build());

        // Invoke
        String result = handler.process(accountId, type, createPayload, appUser);

        // Verify
        assertThat(result).isEqualTo(requestId);
        verify(startProcessRequestService, times(1)).startProcess(requestParams);
    }

    @Test
    void getType() {
        assertThat(handler.getType()).isEqualTo(RequestCreateActionType.PROGRESS_UPDATE_1_P3);
    }
}