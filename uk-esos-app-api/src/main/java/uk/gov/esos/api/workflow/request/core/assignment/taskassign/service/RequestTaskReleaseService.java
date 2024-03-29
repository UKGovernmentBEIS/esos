package uk.gov.esos.api.workflow.request.core.assignment.taskassign.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.authorization.rules.services.AuthorizationRulesQueryService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.core.assignment.requestassign.RequestReleaseService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequestTaskReleaseService {

    private final RequestTaskService requestTaskService;
    private final RequestTaskAssignmentValidationService requestTaskAssignmentValidationService;
    private final RequestReleaseService requestReleaseService;
    private final AuthorizationRulesQueryService authorizationRulesQueryService;

    @Transactional
    public void releaseTaskById(Long taskId) {
        RequestTask task = requestTaskService.findTaskById(taskId);

        // Get Task user's role
        RoleType roleType = authorizationRulesQueryService
                .findRoleTypeByResourceTypeAndSubType(ResourceType.REQUEST_TASK, task.getType().name())
                .orElse(null);

        // Validate task release
        requestTaskAssignmentValidationService.validateTaskReleaseCapability(task, roleType);

        // Release tasks not Peer Review per user role type
        List<RequestTask> requestTasksToRelease = new ArrayList<>();
        requestTasksToRelease.add(task);
        if(!RequestTaskType.getSupportingRequestTaskTypes().contains(task.getType())) {
            requestTasksToRelease.addAll(getAdditionalTasksToRelease(task, roleType));
        }

        requestTasksToRelease.forEach(this::doReleaseTask);
        doReleaseTaskRequest(task);
    }

    private List<RequestTask> getAdditionalTasksToRelease(RequestTask task, RoleType roleType) {
        return requestTaskService
                .findTasksByRequestIdAndRoleType(task.getRequest().getId(), roleType).stream()
                .filter(requestTask -> !RequestTaskType.getSupportingRequestTaskTypes().contains(requestTask.getType())
                        && !requestTask.getId().equals(task.getId()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void releaseTaskForced(RequestTask requestTask) {
        doReleaseTask(requestTask);
        doReleaseTaskRequest(requestTask);
    }
    
    private void doReleaseTask(RequestTask requestTask) {
        requestTask.setAssignee(null);
    }
    
    private void doReleaseTaskRequest(RequestTask requestTask) {
        requestReleaseService.releaseRequest(requestTask); 
    }

}
