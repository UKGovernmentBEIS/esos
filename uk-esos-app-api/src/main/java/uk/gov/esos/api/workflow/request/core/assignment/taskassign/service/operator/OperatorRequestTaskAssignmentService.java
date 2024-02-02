package uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.operator;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.service.AccountContactQueryService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessCheckedException;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.RequestTaskAssignmentService;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.RequestTaskReleaseService;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.UserRoleRequestTaskAssignmentService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.repository.RequestTaskRepository;

import java.util.List;
import java.util.Optional;

@Log4j2
@Service
@AllArgsConstructor
public class OperatorRequestTaskAssignmentService implements UserRoleRequestTaskAssignmentService {

    private final RequestTaskRepository requestTaskRepository;
    private final RequestTaskAssignmentService requestTaskAssignmentService;
    private final AccountContactQueryService accountContactQueryService;
    private final RequestTaskReleaseService requestTaskReleaseService;

    @Override
    public RoleType getRoleType() {
        return RoleType.OPERATOR;
    }

    @Transactional
    public void assignTask(RequestTask requestTask, String userId) {
        try {
            requestTaskAssignmentService.assignToUser(requestTask, userId);
        } catch (BusinessCheckedException e) {
            throw new BusinessException(ErrorCode.ASSIGNMENT_NOT_ALLOWED);
        }
    }

    @Transactional
    public void assignUserTasksToAccountPrimaryContactOrRelease(String userId, Long accountId) {
        List<RequestTask> userRequestTasks = requestTaskRepository
            .findByAssigneeAndRequestAccountIdAndRequestStatus(userId, accountId, RequestStatus.IN_PROGRESS);

        if (!userRequestTasks.isEmpty()) {
            Optional<String> accountPrimaryContactOptional = accountContactQueryService.findPrimaryContactByAccount(accountId);

            accountPrimaryContactOptional.ifPresentOrElse(
                primaryContact -> userRequestTasks.forEach(
                    requestTask -> assignTaskToAccountPrimaryContactOrRelease(requestTask, primaryContact)
                ),
                () -> userRequestTasks.forEach(requestTaskReleaseService::releaseTaskForced)
            );
        }
    }

    private void assignTaskToAccountPrimaryContactOrRelease(RequestTask requestTask, String userId) {
        try {
            requestTaskAssignmentService.assignToUser(requestTask, userId);
        } catch (BusinessCheckedException ex) {
            log.error("Task '{}' cannot be assigned to account primary contact user '{}'", requestTask::getId, () ->userId);
            requestTaskReleaseService.releaseTaskForced(requestTask);
        }
    }
}
