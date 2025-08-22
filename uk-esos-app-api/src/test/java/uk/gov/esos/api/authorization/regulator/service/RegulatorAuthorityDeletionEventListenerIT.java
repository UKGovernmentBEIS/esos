package uk.gov.esos.api.authorization.regulator.service;

import org.junit.jupiter.api.Test;
import org.mockito.InOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationEventPublisher;
import org.testcontainers.junit.jupiter.Testcontainers;

import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.authorization.regulator.event.RegulatorAuthorityDeletionEvent;
import uk.gov.esos.api.workflow.request.WorkflowService;
import uk.gov.esos.api.workflow.request.application.userdeleted.RegulatorAuthorityDeletionEventListener;

import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;

@Testcontainers
@SpringBootTest(
        properties = {
                "camunda.bpm.enabled=false"
        }
)
class RegulatorAuthorityDeletionEventListenerIT extends AbstractContainerBaseTest {

    @Autowired 
    private ApplicationEventPublisher eventPublisher;
    
    @MockBean
    private uk.gov.esos.api.account.service.event.RegulatorAuthorityDeletionEventListener accountRegulatorAuthorityDeletionEventListener;
    
    @MockBean
    private RegulatorAuthorityDeletionEventListener workflowRegulatorAuthorityDeletionEventListener;

    @MockBean
    WorkflowService workflowService;

    @Test
    void listenersInvoked() {
        String userId = "user";
        
        //invoke
        final RegulatorAuthorityDeletionEvent event = RegulatorAuthorityDeletionEvent.builder().userId(userId).build();
        eventPublisher.publishEvent(event);
        
        //verify
        InOrder inOrder = inOrder(accountRegulatorAuthorityDeletionEventListener, 
                                  workflowRegulatorAuthorityDeletionEventListener);
        
        inOrder.verify(accountRegulatorAuthorityDeletionEventListener, times(1)).onRegulatorUserDeletedEvent(event);
        inOrder.verify(workflowRegulatorAuthorityDeletionEventListener, times(1)).onRegulatorUserDeletedEvent(event);
    }
}
