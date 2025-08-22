package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestPayload;

import static org.assertj.core.api.Assertions.assertThat;


@ExtendWith(MockitoExtension.class)
class AccountClosureApplicationSubmitInitializerRequestTaskHandlerTest {

    @InjectMocks
    private AccountClosureApplicationSubmitInitializerRequestTaskHandler handler;

    @Test
    void initializePayload() {
        final long accountId = 1L;
        final Request request = Request.builder()
                .accountId(accountId)
                .payload(ActionPlanP3RequestPayload.builder()
                        .payloadType(RequestPayloadType.ACCOUNT_CLOSURE_REQUEST_PAYLOAD)
                        .build())
                .build();

        final AccountClosureApplicationRequestTaskPayload expected =
                AccountClosureApplicationRequestTaskPayload.builder()
                        .payloadType(RequestTaskPayloadType.ACCOUNT_CLOSURE_APPLICATION_SUBMIT_PAYLOAD)
                        .build();
        // Invoke
        RequestTaskPayload actual = handler.initializePayload(request);

        assertThat(actual)
                .isInstanceOf(AccountClosureApplicationRequestTaskPayload.class)
                .isEqualTo(expected);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(handler.getRequestTaskTypes()).containsExactly(RequestTaskType.ACCOUNT_CLOSURE_SUBMIT);

    }
}