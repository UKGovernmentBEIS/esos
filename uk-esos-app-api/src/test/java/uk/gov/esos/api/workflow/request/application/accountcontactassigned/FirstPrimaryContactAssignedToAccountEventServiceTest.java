package uk.gov.esos.api.workflow.request.application.accountcontactassigned;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.authorization.rules.services.AuthorizationRulesQueryService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.operator.OperatorRequestTaskAssignmentService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.repository.RequestTaskRepository;

import java.util.List;
import java.util.Set;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class FirstPrimaryContactAssignedToAccountEventServiceTest {

    @InjectMocks
    private FirstPrimaryContactAssignedToAccountEventService service;

    @Mock
    private RequestTaskRepository requestTaskRepository;

    @Mock
    private AuthorizationRulesQueryService authorizationRulesQueryService;

    @Mock
    private OperatorRequestTaskAssignmentService operatorRequestTaskAssignmentService;

    @Test
    void assignUnassignedTasksToAccountPrimaryContact() {
        Long accountId = 1L;
        String userId = "userId";
        RequestTask requestTask1 = RequestTask.builder()
            .type(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
            .build();
        RequestTask requestTask2 = RequestTask.builder()
            .type(RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT)
            .build();

        when(requestTaskRepository.
            findByAssigneeAndRequestAccountIdAndRequestStatus(null, accountId, RequestStatus.IN_PROGRESS)
        ).thenReturn(List.of(requestTask1, requestTask2));
        when(authorizationRulesQueryService
            .findResourceSubTypesByResourceTypeAndRoleType(ResourceType.REQUEST_TASK, RoleType.OPERATOR)
        ).thenReturn(Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW.name()));

        service.assignUnassignedTasksToAccountPrimaryContact(accountId, userId);

        verify(requestTaskRepository, times(1))
            .findByAssigneeAndRequestAccountIdAndRequestStatus(null, accountId, RequestStatus.IN_PROGRESS);
        verify(authorizationRulesQueryService, times(1))
            .findResourceSubTypesByResourceTypeAndRoleType(ResourceType.REQUEST_TASK, RoleType.OPERATOR);
        verify(operatorRequestTaskAssignmentService, times(1)).assignTask(requestTask1, userId);
        verifyNoMoreInteractions(operatorRequestTaskAssignmentService);
    }

    @Test
    void assignUnassignedTasksToAccountPrimaryContact_no_unassigned_tasks() {
        Long accountId = 1L;
        String userId = "userId";

        when(requestTaskRepository.
            findByAssigneeAndRequestAccountIdAndRequestStatus(null, accountId, RequestStatus.IN_PROGRESS)
        ).thenReturn(List.of());

        service.assignUnassignedTasksToAccountPrimaryContact(accountId, userId);

        verify(requestTaskRepository, times(1))
            .findByAssigneeAndRequestAccountIdAndRequestStatus(null, accountId, RequestStatus.IN_PROGRESS);
        verifyNoInteractions(authorizationRulesQueryService, operatorRequestTaskAssignmentService);
    }
}
