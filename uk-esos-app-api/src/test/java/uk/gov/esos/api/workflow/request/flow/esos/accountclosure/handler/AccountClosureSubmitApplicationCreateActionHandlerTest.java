package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.StartProcessRequestService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.common.domain.RequestCreateActionEmptyPayload;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureRequestPayload;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountClosureSubmitApplicationCreateActionHandlerTest {

    @InjectMocks
    private AccountClosureSubmitApplicationCreateActionHandler handler;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Test
    void process() {
        final String requestId = "ACL00001";
        final String userId = "userId";
        final AppUser appUser = AppUser.builder().userId(userId).build();
        final Long accountId = 1L;
        final RequestCreateActionEmptyPayload createPayload = RequestCreateActionEmptyPayload.builder().build();
        final RequestCreateActionType type = RequestCreateActionType.ACCOUNT_CLOSURE;

        final RequestParams requestParams = RequestParams.builder()
                .type(RequestType.ACCOUNT_CLOSURE)
                .accountId(accountId)
                .requestPayload(AccountClosureRequestPayload.builder()
                        .payloadType(RequestPayloadType.ACCOUNT_CLOSURE_REQUEST_PAYLOAD)
                        .regulatorAssignee(userId)
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
        assertThat(handler.getType()).isEqualTo(RequestCreateActionType.ACCOUNT_CLOSURE);
    }


}