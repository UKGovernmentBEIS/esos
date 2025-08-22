package uk.gov.esos.api.workflow.bpmn.handler.organisationinstallationopening;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.service.OrganisationAccountOpeningCompleteOnboardingService;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOpeningCompleteOnboardingHandlerTest {

    @InjectMocks
    private OrganisationAccountOpeningCompleteOnboardingHandler organisationAccountOpeningCompleteOnboardingHandler;

    @Mock
    private OrganisationAccountOpeningCompleteOnboardingService organisationAccountOpeningCompleteOnboardingService;

    @Test
    void execute() throws Exception {
        DelegateExecution delegateExecution = mock(DelegateExecution.class);
        String requestId = "REQ-ID";

        when(delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);

        organisationAccountOpeningCompleteOnboardingHandler.execute(delegateExecution);

        verify(organisationAccountOpeningCompleteOnboardingService, times(1)).execute(requestId);
    }
}