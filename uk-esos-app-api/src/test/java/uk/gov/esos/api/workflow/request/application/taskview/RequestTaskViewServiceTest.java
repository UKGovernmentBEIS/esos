package uk.gov.esos.api.workflow.request.application.taskview;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.resource.RequestTaskAuthorizationResourceService;
import uk.gov.esos.api.authorization.rules.services.resource.ResourceCriteria;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.user.application.UserService;
import uk.gov.esos.api.user.core.domain.dto.ApplicationUserDTO;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserDTO;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;

@ExtendWith(MockitoExtension.class)
class RequestTaskViewServiceTest {

    @InjectMocks
    private RequestTaskViewService service;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private UserService userService;

    @Mock
    private RequestTaskAuthorizationResourceService requestTaskAuthorizationResourceService;

    @Test
    void getTaskItemInfo() {
        final String user = "user";
        final Long accountId = 1L;
        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        final AppUser appUser = AppUser.builder().userId(user).firstName("fn").lastName("ln").roleType(RoleType.REGULATOR).build();
        final Long requestTaskId = 1L;
        final RequestType requestType = RequestType.ORGANISATION_ACCOUNT_OPENING;
        final RequestTaskType requestTaskType = RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW;

        final Request request = createRequest("1", ca, accountId, requestType);
        final RequestTask requestTask = createRequestTask(requestTaskId, request, appUser.getUserId(),
            "proceTaskId", requestTaskType);

        final ApplicationUserDTO requestTaskAssigneeUser = RegulatorUserDTO.builder().firstName("fn").lastName("ln").build();

        ResourceCriteria resourceCriteria = ResourceCriteria.builder().accountId(accountId).competentAuthority(ca).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);
        when(userService.getUserById(requestTask.getAssignee())).thenReturn(requestTaskAssigneeUser);
        when(requestTaskAuthorizationResourceService.hasUserAssignScopeOnRequestTasks(appUser, resourceCriteria))
            .thenReturn(true);
        when(requestTaskAuthorizationResourceService.hasUserExecuteScopeOnRequestTaskType(appUser, requestTaskType.name(), resourceCriteria))
                .thenReturn(true);

        //invoke
        RequestTaskItemDTO result = service.getTaskItemInfo(requestTaskId, appUser);

        assertThat(result.getRequestTask().getType()).isEqualTo(requestTaskType);
        assertThat(result.getRequestTask().getDaysRemaining()).isEqualTo(14);
        assertThat(result.getAllowedRequestTaskActions()).isEqualTo(requestTaskType.getAllowedRequestTaskActionTypes());
        assertThat(result.isUserAssignCapable()).isTrue();
        assertThat(result.getRequestTask().getAssigneeUserId()).isEqualTo(user);
        assertThat(result.getRequestInfo().getCompetentAuthority()).isEqualTo(ca);

        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(userService, times(1)).getUserById(requestTask.getAssignee());
        verify(requestTaskAuthorizationResourceService, times(1))
            .hasUserAssignScopeOnRequestTasks(appUser, resourceCriteria);
        verify(requestTaskAuthorizationResourceService, times(1))
                .hasUserExecuteScopeOnRequestTaskType(appUser, requestTaskType.name(), resourceCriteria);
        verifyNoMoreInteractions(requestTaskAuthorizationResourceService);
    }

    @Test
    void getTaskItemInfo_assignee_user_has_not_execute_scope_on_request_tasks() {
        final String user = "user";
        final Long accountId = 1L;
        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        final AppUser appUser = AppUser.builder().userId(user).firstName("fn").lastName("ln").roleType(RoleType.REGULATOR).build();
        final Long requestTaskId = 1L;
        final RequestType requestType = RequestType.ORGANISATION_ACCOUNT_OPENING;
        final RequestTaskType requestTaskType = RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW;

        final Request request = createRequest("1", ca, accountId, requestType);
        final RequestTask requestTask = createRequestTask(requestTaskId, request, user,
            "proceTaskId", requestTaskType);

        final ApplicationUserDTO requestTaskAssigneeUser = RegulatorUserDTO.builder().firstName("fn").lastName("ln").build();

        ResourceCriteria resourceCriteria = ResourceCriteria.builder().accountId(accountId).competentAuthority(ca).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);
        when(userService.getUserById(requestTask.getAssignee())).thenReturn(requestTaskAssigneeUser);
        when(requestTaskAuthorizationResourceService.hasUserAssignScopeOnRequestTasks(appUser, resourceCriteria))
            .thenReturn(false);
        when(requestTaskAuthorizationResourceService.hasUserExecuteScopeOnRequestTaskType(appUser, requestTaskType.name(), resourceCriteria))
            .thenReturn(false);

        //invoke
        RequestTaskItemDTO result = service.getTaskItemInfo(requestTaskId, appUser);

        assertThat(result.getRequestTask().getType()).isEqualTo(requestTaskType);
        assertThat(result.getRequestTask().getDaysRemaining()).isEqualTo(14);
        assertThat(result.getAllowedRequestTaskActions()).isEmpty();
        assertThat(result.isUserAssignCapable()).isFalse();
        assertThat(result.getRequestInfo().getCompetentAuthority()).isEqualTo(ca);

        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(userService, times(1)).getUserById(requestTask.getAssignee());
        verify(requestTaskAuthorizationResourceService, times(1))
            .hasUserAssignScopeOnRequestTasks(appUser, resourceCriteria);
        verify(requestTaskAuthorizationResourceService, times(1))
            .hasUserExecuteScopeOnRequestTaskType(appUser, requestTaskType.name(), resourceCriteria);
    }

    @Test
    void getTaskItemInfo_user_is_not_task_assignee() {
        final String user = "user";
        final Long accountId = 1L;
        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        final AppUser appUser = AppUser.builder().userId(user).firstName("fn").lastName("ln").roleType(RoleType.REGULATOR).build();
        final Long requestTaskId = 1L;
        final RequestType requestType = RequestType.ORGANISATION_ACCOUNT_OPENING;
        final RequestTaskType requestTaskType = RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW;

        final Request request = createRequest("1", ca, accountId, requestType);
        final RequestTask requestTask = createRequestTask(requestTaskId, request, "assignee",
            "proceTaskId", requestTaskType);

        final ApplicationUserDTO requestTaskAssigneeUser = RegulatorUserDTO.builder().firstName("fn").lastName("ln").build();

        ResourceCriteria resourceCriteria = ResourceCriteria.builder().accountId(accountId).competentAuthority(ca).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);
        when(userService.getUserById(requestTask.getAssignee())).thenReturn(requestTaskAssigneeUser);
        when(requestTaskAuthorizationResourceService.hasUserAssignScopeOnRequestTasks(appUser, resourceCriteria))
            .thenReturn(true);

        //invoke
        RequestTaskItemDTO result = service.getTaskItemInfo(requestTaskId, appUser);

        assertThat(result.getRequestTask().getType()).isEqualTo(requestTaskType);
        assertThat(result.getRequestTask().getDaysRemaining()).isEqualTo(14);
        assertThat(result.getAllowedRequestTaskActions()).isEmpty();
        assertThat(result.isUserAssignCapable()).isTrue();
        assertThat(result.getRequestInfo().getCompetentAuthority()).isEqualTo(ca);

        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(userService, times(1)).getUserById(requestTask.getAssignee());
        verify(requestTaskAuthorizationResourceService, times(1))
            .hasUserAssignScopeOnRequestTasks(appUser, resourceCriteria);
        verify(requestTaskAuthorizationResourceService, never())
            .hasUserExecuteScopeOnRequestTaskType(any(), anyString(), any());
    }

    @Test
    public void getRequestTasks() {
        final String user = "user";
        final AppUser appUser = AppUser.builder().userId(user).firstName("fn").lastName("ln").roleType(RoleType.REGULATOR).build();
        Set<String> expectedResourceScopePermissions = Set.of(
            RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW.toString()
        );

        when(requestTaskAuthorizationResourceService.findRequestTaskTypesByRoleType(RoleType.REGULATOR)).thenReturn(
            expectedResourceScopePermissions);

        Set<RequestTaskType> actualRequestTasks = service.getRequestTaskTypes(appUser.getRoleType());

        assertThat(actualRequestTasks.size()).isEqualTo(expectedResourceScopePermissions.size());
        assertThat(actualRequestTasks).containsAll(Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW));
    }

    private Request createRequest(String requestId, CompetentAuthorityEnum ca,
        Long accountId, RequestType requestType) {
        return Request.builder()
            .id(requestId)
            .type(requestType)
            .competentAuthority(ca)
            .status(RequestStatus.IN_PROGRESS)
            .processInstanceId("procInst")
            .accountId(accountId)
            .creationDate(LocalDateTime.now())
            .build();
    }

    private RequestTask createRequestTask(Long requestTaskId, Request request, String assignee, String processTaskId,
        RequestTaskType requestTaskType) {
        return RequestTask.builder()
            .id(requestTaskId)
            .request(request)
            .processTaskId(processTaskId)
            .type(requestTaskType)
            .assignee(assignee)
            .dueDate(LocalDate.now().plusDays(14))
            .build();
    }
}
