package uk.gov.esos.api.workflow.bpmn.handler.organisationinstallationopening;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.service.OrganisationAccountOpeningSendApprovalEmailService;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.service.OrganisationAccountOpeningSendRejectionEmailService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOpeningSendRejectionEmailHandlerTest {

    @InjectMocks
    private OrganisationAccountOpeningSendRejectionEmailHandler sendRejectionEmailHandler;

    @Mock
    private OrganisationAccountOpeningSendRejectionEmailService sendRejectionEmailService;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() {
        String requestId = "1";

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);

        sendRejectionEmailHandler.execute(execution);

        verify(execution, times(1)).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(sendRejectionEmailService, times(1)).sendEmail(requestId);
    }
}