package uk.gov.esos.api.workflow.request.application.accountcontactassigned;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.authorization.rules.services.AuthorizationRulesQueryService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.operator.OperatorRequestTaskAssignmentService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.repository.RequestTaskRepository;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FirstPrimaryContactAssignedToAccountEventService {

    private final RequestTaskRepository requestTaskRepository;
    private final AuthorizationRulesQueryService authorizationRulesQueryService;
    private final OperatorRequestTaskAssignmentService operatorRequestTaskAssignmentService;

    @Transactional
    public void assignUnassignedTasksToAccountPrimaryContact(Long accountId, String userId) {
        //find all unassigned tasks for the account id
        List<RequestTask> unassignedRequestTasks = requestTaskRepository
            .findByAssigneeAndRequestAccountIdAndRequestStatus(null, accountId, RequestStatus.IN_PROGRESS);

        if(!unassignedRequestTasks.isEmpty()) {
            //filter unassigned tasks using the user role (OPERATOR)
            Set<String> operatorRequestTaskTypes = authorizationRulesQueryService
                .findResourceSubTypesByResourceTypeAndRoleType(ResourceType.REQUEST_TASK, RoleType.OPERATOR);

            List<RequestTask> unassignedOperatorRelatedRequestTasks = unassignedRequestTasks.stream()
                .filter(requestTask -> operatorRequestTaskTypes.contains(requestTask.getType().name()))
                .toList();

            //assign tasks to user
            unassignedOperatorRelatedRequestTasks.forEach(
                requestTask -> operatorRequestTaskAssignmentService.assignTask(requestTask, userId));
        }
    }
}
