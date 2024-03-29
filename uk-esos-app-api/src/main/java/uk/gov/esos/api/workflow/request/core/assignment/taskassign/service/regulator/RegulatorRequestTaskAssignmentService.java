package uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.regulator;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.domain.enumeration.AccountContactType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessCheckedException;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.RequestTaskAssignmentService;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.SiteContactRequestTaskAssignmentService;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.UserRoleRequestTaskAssignmentService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

@Service
@AllArgsConstructor
public class RegulatorRequestTaskAssignmentService implements UserRoleRequestTaskAssignmentService {

    private final RequestTaskAssignmentService requestTaskAssignmentService;
    private final SiteContactRequestTaskAssignmentService siteContactRequestTaskAssignmentService;

    @Override
    public RoleType getRoleType() {
        return RoleType.REGULATOR;
    }

    @Transactional
    public void assignTask(RequestTask requestTask, String userId) {
        boolean isSupportingTask = RequestTaskType.getSupportingRequestTaskTypes().contains(requestTask.getType());
        if(isSupportingTask) {
            assignSupportingTask(requestTask, userId);
        } else {
            assignTaskToUser(requestTask, userId);
        }
    }

    @Transactional
    public void assignTasksOfDeletedRegulatorToCaSiteContactOrRelease(String userDeleted) {
        siteContactRequestTaskAssignmentService
            .assignTasksOfDeletedUserToSiteContactOrRelease(userDeleted, AccountContactType.CA_SITE);
    }

    private void assignSupportingTask(RequestTask requestTask, String userId) {
        String firstReviewer = requestTask.getRequest().getPayload().getRegulatorReviewer();
        if(userId.equals(firstReviewer)) {
            throw new BusinessException(ErrorCode.ASSIGNMENT_NOT_ALLOWED);
        } else {
            assignTaskToUser(requestTask, userId);
        }
    }

    private void assignTaskToUser(RequestTask requestTask, String userId) {
        try {
            requestTaskAssignmentService.assignToUser(requestTask, userId);
        } catch (BusinessCheckedException e) {
            throw new BusinessException(ErrorCode.ASSIGNMENT_NOT_ALLOWED);
        }
    }
}
