package uk.gov.esos.api.web.controller.workflow;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

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
import uk.gov.esos.api.token.FileToken;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;
import uk.gov.esos.api.web.security.AppSecurityComponent;
import uk.gov.esos.api.workflow.request.application.filedocument.requestaction.RequestActionFileDocumentService;

@ExtendWith(MockitoExtension.class)
class RequestActionFileDocumentControllerTest {

    private static final String BASE_PATH = "/v1.0/request-action-file-documents";

    private MockMvc mockMvc;

    @InjectMocks
    private RequestActionFileDocumentController controller;

    @Mock
    private RequestActionFileDocumentService requestActionFileDocumentService;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @BeforeEach
    public void setUp() {
        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
        aspectJProxyFactory.addAspect(aspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);

        controller = (RequestActionFileDocumentController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            .setControllerAdvice(new ExceptionControllerAdvice())
            .build();
    }

    @Test
    void generateRequestActionGetFileFileDocumentToken() throws Exception {
        Long requestActionId = 1L;
        UUID fileDocumentUuid = UUID.randomUUID();
        FileToken expectedToken = FileToken.builder().token("token").build();

        when(requestActionFileDocumentService.generateGetFileDocumentToken(requestActionId, fileDocumentUuid)).thenReturn(expectedToken);

        mockMvc.perform(MockMvcRequestBuilders
            .get(BASE_PATH + "/" + requestActionId)
            .param("fileDocumentUuid", fileDocumentUuid.toString())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value(expectedToken.getToken()));

        verify(requestActionFileDocumentService, times(1)).generateGetFileDocumentToken(requestActionId, fileDocumentUuid);
    }

    @Test
    void generateRequestActionGetFileFileDocumentToken_forbidden() throws Exception {
        Long requestActionId = 1L;
        UUID fileDocumentUuid = UUID.randomUUID();
        AppUser pmrvUser = AppUser.builder().userId("userId").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(pmrvUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(pmrvUser, "generateRequestActionGetFileDocumentToken", String.valueOf(requestActionId));

        mockMvc.perform(MockMvcRequestBuilders
            .get(BASE_PATH + "/" + requestActionId)
            .param("fileDocumentUuid", fileDocumentUuid.toString()))
            .andExpect(status().isForbidden());

        verifyNoInteractions(requestActionFileDocumentService);
    }
}