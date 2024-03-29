package uk.gov.esos.api.workflow.request.core.assignment.taskassign.service;

import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;

public interface UserRoleRequestTaskDefaultAssignmentService {

    void assignDefaultAssigneeToTask(RequestTask requestTask);
    RoleType getRoleType();
}
