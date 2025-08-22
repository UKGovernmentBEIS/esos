package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.InitializeRequestTaskHandler;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureApplicationRequestTaskPayload;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AccountClosureApplicationSubmitInitializerRequestTaskHandler implements InitializeRequestTaskHandler {

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        return AccountClosureApplicationRequestTaskPayload.builder()
                .payloadType(RequestTaskPayloadType.ACCOUNT_CLOSURE_APPLICATION_SUBMIT_PAYLOAD).build();
    }

    @Override
    public Set<RequestTaskType> getRequestTaskTypes() {
        return Set.of(RequestTaskType.ACCOUNT_CLOSURE_SUBMIT);
    }
}
