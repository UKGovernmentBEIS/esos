package uk.gov.esos.api.web.controller.workflow;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;
import uk.gov.esos.api.web.security.AppSecurityComponent;
import uk.gov.esos.api.workflow.request.application.taskview.RequestTaskDTO;
import uk.gov.esos.api.workflow.request.application.taskview.RequestTaskItemDTO;
import uk.gov.esos.api.workflow.request.application.taskview.RequestTaskViewService;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestTaskActionProcessDTO;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandlerMapper;
import uk.gov.esos.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

@ExtendWith(MockitoExtension.class)
class RequestTaskControllerTest {

    private static final String BASE_PATH = "/v1.0/tasks";

    private MockMvc mockMvc;

    @InjectMocks
    private RequestTaskController requestTaskController;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private RequestTaskViewService requestTaskViewService;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private RequestTaskActionHandlerMapper requestTaskActionHandlerMapper;

    @Mock
    private RequestTaskActionHandler<RequestTaskActionEmptyPayload> requestTaskActionHandler;

    private ObjectMapper mapper;

    @BeforeEach
    public void setUp() {
        mapper = new ObjectMapper();

        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(requestTaskController);
        aspectJProxyFactory.addAspect(aspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);

        requestTaskController = (RequestTaskController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(requestTaskController)
            .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            .setControllerAdvice(new ExceptionControllerAdvice())
            .build();
    }

    @Test
    void getTaskItemInfoById() throws Exception {
        AppUser user = AppUser.builder().firstName("fn").lastName("ln").build();
        RequestTaskType requestTaskType = RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW;
        Long requestTaskId = 1L;
        RequestTaskItemDTO taskItem = createTaskItem(requestTaskId, requestTaskType);

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(requestTaskViewService.getTaskItemInfo(requestTaskId, user)).thenReturn(taskItem);
        mockMvc.perform(
                MockMvcRequestBuilders.get(BASE_PATH + "/" + requestTaskId)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.requestTask.type").value(requestTaskType.name()))
            .andExpect(jsonPath("$.requestTask.id").value(requestTaskId));

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verify(requestTaskViewService, times(1)).getTaskItemInfo(requestTaskId, user);
    }

    @Test
    void getTaskItemInfoById_forbidden() throws Exception {
        AppUser user = AppUser.builder().firstName("fn").lastName("ln").build();
        long requestTaskId = 1L;

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(user, "getTaskItemInfoById", String.valueOf(requestTaskId));

        mockMvc.perform(
                MockMvcRequestBuilders.get(BASE_PATH + "/" + requestTaskId)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verify(requestTaskViewService, never()).getTaskItemInfo(anyLong(), any());
    }

    @Test
    void processRequestTaskAction() throws Exception {
        AppUser pmrvUser = AppUser.builder().userId("id").build();
        RequestTaskActionEmptyPayload dismissPayload = RequestTaskActionEmptyPayload.builder()
            .payloadType(RequestTaskActionPayloadType.EMPTY_PAYLOAD)
            .build();
        RequestTaskActionProcessDTO requestTaskActionProcessDTO = RequestTaskActionProcessDTO.builder()
            .requestTaskId(1L)
            .requestTaskActionType(RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_DECISION)
            .requestTaskActionPayload(dismissPayload)
            .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(pmrvUser);
        when(requestTaskActionHandlerMapper.get(RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_DECISION)).thenReturn(requestTaskActionHandler);

        mockMvc.perform(MockMvcRequestBuilders
                .post(BASE_PATH + "/actions")
                .content(mapper.writeValueAsString(requestTaskActionProcessDTO))
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        verify(requestTaskActionHandler, times(1)).process(requestTaskActionProcessDTO.getRequestTaskId(),
            RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_DECISION,
            pmrvUser,
            (RequestTaskActionEmptyPayload) requestTaskActionProcessDTO.getRequestTaskActionPayload());
    }

    @Test
    void processRequestTaskAction_forbidden() throws Exception {
        AppUser pmrvUser = AppUser.builder().userId("id").build();
        RequestTaskActionEmptyPayload dismissPayload = RequestTaskActionEmptyPayload.builder()
            .payloadType(RequestTaskActionPayloadType.EMPTY_PAYLOAD)
            .build();
        RequestTaskActionProcessDTO requestTaskActionProcessDTO = RequestTaskActionProcessDTO.builder()
            .requestTaskId(1L)
            .requestTaskActionType(RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_DECISION)
            .requestTaskActionPayload(dismissPayload)
            .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(pmrvUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(pmrvUser, "processRequestTaskAction", "1");

        mockMvc.perform(MockMvcRequestBuilders
                .post(BASE_PATH + "/actions")
                .content(mapper.writeValueAsString(requestTaskActionProcessDTO))
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        verify(requestTaskActionHandler, never()).process(anyLong(), any(), any(), any());
    }

    private RequestTaskItemDTO createTaskItem(Long taskid, RequestTaskType type) {
        return RequestTaskItemDTO.builder()
            .requestTask(RequestTaskDTO.builder()
                .type(type)
                .id(taskid)
                .build())
            .allowedRequestTaskActions(List.of())
            .userAssignCapable(false)
            .build();
    }


}
