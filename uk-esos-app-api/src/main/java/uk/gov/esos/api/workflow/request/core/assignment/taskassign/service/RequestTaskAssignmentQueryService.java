package uk.gov.esos.api.workflow.request.core.assignment.taskassign.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.resource.RequestTaskAuthorizationResourceService;
import uk.gov.esos.api.authorization.rules.services.resource.ResourceCriteria;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.user.core.domain.model.UserInfo;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.dto.AssigneeUserInfoDTO;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.transform.AssigneeUserInfoMapper;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service responsible for performing query assignments on {@link RequestTask} objects.
 */
@Service
@RequiredArgsConstructor
public class RequestTaskAssignmentQueryService {

    private final RequestTaskService requestTaskService;
    private final UserAuthService userAuthService;
    private final RequestTaskAssignmentValidationService requestTaskAssignmentValidationService;
    private final RequestTaskAuthorizationResourceService requestTaskAuthorizationResourceService;
    private final AssigneeUserInfoMapper assigneeUserInfoMapper = Mappers.getMapper(AssigneeUserInfoMapper.class);

    /**
     * Retrieves all user that have the authority to be assigned to the provided task id.
     * @param taskId the task Id
     * @param authenticatedUser the user {@link AppUser} that performs the action
     * @return {@link List} of {@link UserInfo}
     */
    @Transactional(readOnly = true)
    public List<AssigneeUserInfoDTO> getCandidateAssigneesByTaskId(Long taskId, AppUser authenticatedUser) {
        RequestTask requestTask = requestTaskService.findTaskById(taskId);

        requestTaskAssignmentValidationService.validateTaskAssignmentCapability(requestTask);
        
        ResourceCriteria resourceCriteria = 
                ResourceCriteria.builder()
                    .accountId(requestTask.getRequest().getAccountId())
                    .competentAuthority(requestTask.getRequest().getCompetentAuthority())
                    .verificationBodyId(requestTask.getRequest().getVerificationBodyId())
                    .build();

        List<String> candidateAssignees = getCandidateAssigneesByCriteriaAndRoleType(
            requestTask.getType(),
            resourceCriteria,
            authenticatedUser.getRoleType());

        if(isSupportingTaskType(requestTask.getType())) {
            candidateAssignees.remove(requestTask.getRequest().getPayload().getRegulatorReviewer());
        }

        return getCandidateAssigneesUserInfo(candidateAssignees);
    }

    @Transactional(readOnly = true)
    public List<AssigneeUserInfoDTO> getCandidateAssigneesByTaskType(Long taskId, RequestTaskType taskType, AppUser authenticatedUser) {
        requestTaskAssignmentValidationService.validateTaskAssignmentCapability(taskType);

        RequestTask requestTask = requestTaskService.findTaskById(taskId);
        Request request = requestTask.getRequest();

        ResourceCriteria resourceCriteria = ResourceCriteria.builder()
            .accountId(request.getAccountId())
            .competentAuthority(request.getCompetentAuthority())
            .build();

        List<String> candidateAssignees = getCandidateAssigneesByCriteriaAndRoleType(
            taskType,
            resourceCriteria,
            authenticatedUser.getRoleType());

        if(isSupportingTaskType(taskType)) {
            candidateAssignees.remove(authenticatedUser.getUserId());
        }

        return getCandidateAssigneesUserInfo(candidateAssignees);
    }


    private List<String> getCandidateAssigneesByCriteriaAndRoleType(RequestTaskType requestTaskType,
                                                                    ResourceCriteria resourceCriteria, RoleType roleType) {
        return requestTaskAuthorizationResourceService.findUsersWhoCanExecuteRequestTaskTypeByAccountCriteriaAndRoleType(
            requestTaskType.name(),
            resourceCriteria,
            roleType);
    }

    private boolean isSupportingTaskType(RequestTaskType requestTaskType) {
        return RequestTaskType.getSupportingRequestTaskTypes().contains(requestTaskType);
    }

    private List<AssigneeUserInfoDTO> getCandidateAssigneesUserInfo(List<String> candidateAssignees) {
        return userAuthService.getUsers(candidateAssignees).stream()
            .map(assigneeUserInfoMapper::toAssigneeUserInfoDTO)
            .collect(Collectors.toList());
    }
}
