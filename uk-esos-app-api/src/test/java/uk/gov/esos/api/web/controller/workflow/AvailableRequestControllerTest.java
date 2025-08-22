package uk.gov.esos.api.web.controller.workflow;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;
import uk.gov.esos.api.web.security.AppSecurityComponent;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.service.AvailableRequestService;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;

import java.util.Map;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AvailableRequestControllerTest {

    private static final String BASE_PATH = "/v1.0/requests/available-workflows";

    private MockMvc mockMvc;

    @InjectMocks
    private AvailableRequestController controller;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private AvailableRequestService availableRequestService;

    @BeforeEach
    public void setUp() {

        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
        aspectJProxyFactory.addAspect(aspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);

        controller = (AvailableRequestController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
                .setControllerAdvice(new ExceptionControllerAdvice())
                .build();
    }

    @Test
    void getAvailableAccountWorkflows() throws Exception {
        final Long accountId = 1L;
        final AppUser pmrvUser = AppUser.builder().userId("id").build();
        final Map<RequestCreateActionType, RequestCreateValidationResult> results =
                Map.of(RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION,
                        RequestCreateValidationResult.builder().valid(true).build());

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(pmrvUser);
        when(availableRequestService.getAvailableAccountWorkflows(accountId, pmrvUser)).thenReturn(results);

        mockMvc.perform(MockMvcRequestBuilders.get(BASE_PATH + "/permit/" + accountId))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION\":{\"valid\":true}}"));

        verify(availableRequestService, times(1)).getAvailableAccountWorkflows(accountId, pmrvUser);
    }

    @Test
    void getAvailableRelatedActionsWorkflows() throws Exception {
        final String requestId = "NOC000001-P3";
        final AppUser pmrvUser = AppUser.builder().userId("id").build();
        final Map<RequestCreateActionType, RequestCreateValidationResult> results =
                Map.of(RequestCreateActionType.NOTIFICATION_OF_COMPLIANCE_P3,
                        RequestCreateValidationResult.builder().valid(true).build());

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(pmrvUser);
        when(availableRequestService.getAvailableRequestWorkflows(requestId, pmrvUser)).thenReturn(results);

        mockMvc.perform(MockMvcRequestBuilders.get(BASE_PATH + "/reporting/related-actions/" + requestId))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"NOTIFICATION_OF_COMPLIANCE_P3\":{\"valid\":true}}"));

        verify(availableRequestService, times(1)).getAvailableRequestWorkflows(requestId, pmrvUser);
    }
}
