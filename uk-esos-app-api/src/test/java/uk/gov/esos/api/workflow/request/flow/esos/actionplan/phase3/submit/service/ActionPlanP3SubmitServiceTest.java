package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.actionplan.common.service.ActionPlanService;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.domain.ActionPlanP3ApplicationSubmitRequestTaskPayload;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ActionPlanP3SubmitServiceTest {

    @Mock
    private ActionPlanService actionPlanService;

    @InjectMocks
    private ActionPlanP3SubmitService actionPlanP3SubmitService;

    @Test
    public void testSubmitActionPlanAction() {
        // Arrange
        RequestTask requestTask = mock(RequestTask.class);
        Request request = mock(Request.class);
        ActionPlanP3RequestPayload requestPayload = mock(ActionPlanP3RequestPayload.class);
        ActionPlanP3ApplicationSubmitRequestTaskPayload applicationSubmitRequestTaskPayload = mock(ActionPlanP3ApplicationSubmitRequestTaskPayload.class);

        when(requestTask.getRequest()).thenReturn(request);
        when(request.getPayload()).thenReturn(requestPayload);
        when(requestTask.getPayload()).thenReturn(applicationSubmitRequestTaskPayload);

        // Mock values inside applicationSubmitRequestTaskPayload
        ActionPlanP3 actionPlanP3 = mock(ActionPlanP3.class);
        when(applicationSubmitRequestTaskPayload.getActionPlanP3()).thenReturn(actionPlanP3);

        // Since actionPlanSectionsCompleted is now a Map, we use a Map mock
        Map<String, String> actionPlanSectionsCompleted = new HashMap<>();
        when(applicationSubmitRequestTaskPayload.getActionPlanSectionsCompleted()).thenReturn(actionPlanSectionsCompleted);

        // Mock the attachments list
        Map<UUID, String> actionPlanAttachments = new HashMap<>();
        when(applicationSubmitRequestTaskPayload.getActionPlanAttachments()).thenReturn(actionPlanAttachments);

        // Act
        actionPlanP3SubmitService.submitActionPlanAction(requestTask);

        // Assert
        verify(requestPayload).setActionPlan(actionPlanP3);
        verify(requestPayload).setActionPlanSectionsCompleted(actionPlanSectionsCompleted);
        verify(requestPayload).setActionPlanAttachments(actionPlanAttachments);

        verify(actionPlanService, times(1)).submitActionPlan(any());
    }

}