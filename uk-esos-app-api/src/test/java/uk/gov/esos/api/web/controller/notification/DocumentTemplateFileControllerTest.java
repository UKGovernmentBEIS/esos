package uk.gov.esos.api.web.controller.notification;

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
import uk.gov.esos.api.notification.template.service.DocumentTemplateFileService;
import uk.gov.esos.api.token.FileToken;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;
import uk.gov.esos.api.web.security.AppSecurityComponent;

@ExtendWith(MockitoExtension.class)
class DocumentTemplateFileControllerTest {

    private static final String DOCUMENT_TEMPLATE_FILES_CONTROLLER_PATH = "/v1.0/document-template-files";

    private MockMvc mockMvc;

    @InjectMocks
    private DocumentTemplateFileController documentTemplateFileController;

    @Mock
    private DocumentTemplateFileService documentTemplateFileService;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @BeforeEach
    public void setUp() {
        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect
            authorizedAspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(documentTemplateFileController);
        aspectJProxyFactory.addAspect(authorizedAspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);

        documentTemplateFileController = (DocumentTemplateFileController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(documentTemplateFileController)
            .setControllerAdvice(new ExceptionControllerAdvice())
            .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            .build()
        ;
    }

    @Test
    void generateGetDocumentTemplateFileToken() throws Exception {
        Long documentTemplateId = 1L;
        UUID fileUuid = UUID.randomUUID();
        FileToken fileToken = FileToken.builder().token("token").tokenExpirationMinutes(10L).build();

        when(documentTemplateFileService.generateGetFileDocumentTemplateToken(documentTemplateId, fileUuid)).thenReturn(fileToken);

        mockMvc.perform(MockMvcRequestBuilders
            .get(DOCUMENT_TEMPLATE_FILES_CONTROLLER_PATH + "/" + documentTemplateId)
            .param("fileUuid", String.valueOf(fileUuid))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value(fileToken.getToken()))
            .andExpect(jsonPath("$.tokenExpirationMinutes").value(fileToken.getTokenExpirationMinutes()));

        verify(documentTemplateFileService, times(1))
            .generateGetFileDocumentTemplateToken(documentTemplateId, fileUuid);
    }

    @Test
    void generateGetDocumentTemplateFileToken_forbidden() throws Exception {
        Long documentTemplateId = 1L;
        UUID fileUuid = UUID.randomUUID();
        AppUser pmrvUser = AppUser.builder().userId("userId").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(pmrvUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(pmrvUser, "generateGetDocumentTemplateFileToken", String.valueOf(documentTemplateId));

        mockMvc.perform(MockMvcRequestBuilders
            .get(DOCUMENT_TEMPLATE_FILES_CONTROLLER_PATH + "/" + documentTemplateId)
            .param("fileUuid", String.valueOf(fileUuid)))
            .andExpect(status().isForbidden());

        verifyNoInteractions(documentTemplateFileService);
    }
}