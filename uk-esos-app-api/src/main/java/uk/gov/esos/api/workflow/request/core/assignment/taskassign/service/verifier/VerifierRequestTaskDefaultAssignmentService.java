package uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.verifier;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import uk.gov.esos.api.account.service.AccountVbSiteContactService;
import uk.gov.esos.api.authorization.core.service.UserRoleTypeService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessCheckedException;
import uk.gov.esos.api.workflow.request.core.assignment.requestassign.RequestReleaseService;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.RequestTaskAssignmentService;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.UserRoleRequestTaskDefaultAssignmentService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;

@Log4j2
@Service
@RequiredArgsConstructor
public class VerifierRequestTaskDefaultAssignmentService implements UserRoleRequestTaskDefaultAssignmentService {

    private final RequestTaskAssignmentService requestTaskAssignmentService;
    private final AccountVbSiteContactService accountVbSiteContactService;
    private final RequestReleaseService requestReleaseService;
    private final UserRoleTypeService userRoleTypeService;

    @Override
    public RoleType getRoleType() {
        return RoleType.VERIFIER;
    }

    @Transactional
    public void assignDefaultAssigneeToTask(RequestTask requestTask) {
        String requestAssignee = requestTask.getRequest().getPayload().getVerifierAssignee();

        if(!ObjectUtils.isEmpty(requestAssignee) && userRoleTypeService.isUserVerifier(requestAssignee)){
            try {
                requestTaskAssignmentService.assignToUser(requestTask, requestAssignee);
            } catch (BusinessCheckedException e) {
                assignTaskToSiteContact(requestTask);
            }
        } else {
            assignTaskToSiteContact(requestTask);
        }
    }

    private void assignTaskToSiteContact(RequestTask requestTask) {
        accountVbSiteContactService
                .getVBSiteContactByAccount(requestTask.getRequest().getAccountId())
                .ifPresentOrElse(
                        vbSiteContactUserId -> {
                            try {
                                requestTaskAssignmentService.assignToUser(requestTask, vbSiteContactUserId);
                            } catch (BusinessCheckedException e) {
                                log.error("Request task '{}' for verifier user will remain unassigned. Error msg : '{}'" ,
                                        requestTask::getId, e::getMessage);
                                requestReleaseService.releaseRequest(requestTask);
                            }
                        },
                        () -> requestReleaseService.releaseRequest(requestTask)
                );
    }
}
