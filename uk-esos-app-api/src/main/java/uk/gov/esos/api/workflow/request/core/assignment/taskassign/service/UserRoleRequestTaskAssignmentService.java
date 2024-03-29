package uk.gov.esos.api.workflow.request.core.assignment.taskassign.service;

import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;

public interface UserRoleRequestTaskAssignmentService {

    void assignTask(RequestTask requestTask, String userId);
    RoleType getRoleType();
}
