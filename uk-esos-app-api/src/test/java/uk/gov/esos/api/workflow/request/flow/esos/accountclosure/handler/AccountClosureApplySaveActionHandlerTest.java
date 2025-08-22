package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureSaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service.AccountClosureApplyService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountClosureApplySaveActionHandlerTest {

    @InjectMocks
    private AccountClosureApplySaveActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private AccountClosureApplyService service;

    @Test
    void process() {
        final long requestTaskId = 1L;
        final AppUser appUser = AppUser.builder().userId("userId").build();
        final AccountClosureSaveApplicationRequestTaskActionPayload taskActionPayload =
                AccountClosureSaveApplicationRequestTaskActionPayload.builder()
                        .payloadType(RequestTaskActionPayloadType.ACCOUNT_CLOSURE_SAVE_APPLICATION_SUBMIT_PAYLOAD)
                        .build();
        final RequestTask requestTask = RequestTask.builder().id(requestTaskId).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        // Invoke
        handler.process(requestTaskId, RequestTaskActionType.ACCOUNT_CLOSURE_SUBMIT_APPLICATION, appUser, taskActionPayload);

        // Verify
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(service, times(1)).applySaveAction(taskActionPayload, requestTask);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(RequestTaskActionType.ACCOUNT_CLOSURE_SAVE_APPLICATION_SUBMIT);

    }
}