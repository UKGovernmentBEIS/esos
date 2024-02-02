package uk.gov.esos.api.web.controller.workflow;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.common.domain.dto.FileUuidDTO;
import uk.gov.esos.api.token.FileToken;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;
import uk.gov.esos.api.web.security.AppSecurityComponent;
import uk.gov.esos.api.workflow.request.application.attachment.task.RequestTaskAttachmentActionProcessDTO;
import uk.gov.esos.api.workflow.request.application.attachment.task.RequestTaskAttachmentService;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestTaskAttachmentUploadService;

@ExtendWith(MockitoExtension.class)
class RequestTaskAttachmentControllerTest {

    private static final String BASE_PATH = "/v1.0/task-attachments";

    private MockMvc mockMvc;

    @InjectMocks
    private RequestTaskAttachmentController requestTaskAttachmentController;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private RequestTaskAttachmentUploadService requestTaskAttachmentUploadService;

    @Mock
    private RequestTaskAttachmentService requestTaskAttachmentService;

    private ObjectMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = new ObjectMapper();

        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(requestTaskAttachmentController);
        aspectJProxyFactory.addAspect(aspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);

        requestTaskAttachmentController = (RequestTaskAttachmentController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(requestTaskAttachmentController)
                .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
                .setControllerAdvice(new ExceptionControllerAdvice())
            .build();
    }

    @Test
    void uploadRequestTaskAttachment() throws Exception {
        AppUser authUser = AppUser.builder().userId("id").build();
        Long requestTaskId = 1L;
        RequestTaskActionType requestTaskActionType = RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_UPLOAD_ATTACHMENT;
        String attachmentName = "attachment";
        String attachmentOriginalFileName = "filename.txt";
        String attachmentContentType = "text/plain";
        byte[] attachmentContent = "content".getBytes();
        RequestTaskAttachmentActionProcessDTO requestTaskAttachmentActionProcessDTO = RequestTaskAttachmentActionProcessDTO.builder()
                .requestTaskId(requestTaskId)
                .requestTaskActionType(requestTaskActionType)
                .build();

        MockMultipartFile attachmentFile = new MockMultipartFile(attachmentName, attachmentOriginalFileName, attachmentContentType, attachmentContent);
        MockMultipartFile requestTaskActionDetails = new MockMultipartFile("requestTaskActionDetails", "", "application/json",
                mapper.writeValueAsString(requestTaskAttachmentActionProcessDTO).getBytes());
        FileDTO fileDTO = FileDTO.builder()
            .fileName(attachmentOriginalFileName)
            .fileType(attachmentContentType)
            .fileContent(attachmentContent)
            .fileSize(attachmentFile.getSize())
            .build();

        UUID attachmentUuid = UUID.randomUUID();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(authUser);
        when(requestTaskAttachmentUploadService.uploadAttachment(requestTaskId, requestTaskActionType, authUser, fileDTO))
            .thenReturn(FileUuidDTO.builder().uuid(attachmentUuid.toString()).build());

        mockMvc.perform(
                MockMvcRequestBuilders.multipart(BASE_PATH + "/upload")
                    .file(attachmentFile)
                    .file(requestTaskActionDetails)
                    )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid").value(attachmentUuid.toString()));

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verify(requestTaskAttachmentUploadService, times(1)).uploadAttachment(requestTaskId, requestTaskActionType, authUser, fileDTO);
    }

    @Test
    void uploadRequestTaskAttachment_forbidden() throws Exception {
        AppUser authUser = AppUser.builder().userId("id").build();
        Long requestTaskId = 1L;
        RequestTaskActionType requestTaskActionType = RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_UPLOAD_ATTACHMENT;
        RequestTaskAttachmentActionProcessDTO requestTaskAttachmentActionProcessDTO = RequestTaskAttachmentActionProcessDTO.builder()
                .requestTaskId(requestTaskId)
                .requestTaskActionType(requestTaskActionType)
                .build();

        MockMultipartFile attachmentFile = new MockMultipartFile("attachment", "filename.txt", "text/plain", "content".getBytes());
        MockMultipartFile requestTaskActionDetails = new MockMultipartFile("requestTaskActionDetails", "filename.txt", "application/json",
                mapper.writeValueAsString(requestTaskAttachmentActionProcessDTO).getBytes());

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(authUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(authUser, "uploadRequestTaskAttachment", String.valueOf(requestTaskId));

        mockMvc.perform(
                MockMvcRequestBuilders.multipart(BASE_PATH + "/upload")
                    .file(attachmentFile)
                    .file(requestTaskActionDetails)
                    )
                .andExpect(status().isForbidden());

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verifyNoInteractions(requestTaskAttachmentUploadService);
    }

    @Test
    void generateRequestTaskGetFileAttachmentToken() throws Exception {
        Long requestTaskId = 1L;
        UUID attachmentUuid = UUID.randomUUID();
        FileToken expectedToken = FileToken.builder().token("token").build();

        when(requestTaskAttachmentService.generateGetFileAttachmentToken(requestTaskId, attachmentUuid)).thenReturn(expectedToken);

        mockMvc.perform(MockMvcRequestBuilders
            .get(BASE_PATH + "/" + requestTaskId)
            .param("attachmentUuid", attachmentUuid.toString())
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value(expectedToken.getToken()));

        verify(requestTaskAttachmentService, times(1)).generateGetFileAttachmentToken(requestTaskId, attachmentUuid);
    }

    @Test
    void generateRequestTaskGetFileAttachmentToken_forbidden() throws Exception {
        Long requestTaskId = 1L;
        UUID attachmentUuid = UUID.randomUUID();
        AppUser pmrvUser = AppUser.builder().userId("userId").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(pmrvUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(pmrvUser, "generateRequestTaskGetFileAttachmentToken", String.valueOf(requestTaskId));

        mockMvc.perform(MockMvcRequestBuilders
            .get(BASE_PATH + "/" + requestTaskId)
            .param("attachmentUuid", attachmentUuid.toString()))
            .andExpect(status().isForbidden());

        verifyNoInteractions(requestTaskAttachmentService);
    }

    @Test
    @DisplayName("Should throw BAD REQUEST (400) when no attachment is provided")
    void uploadRequestTaskNoAttachment() throws Exception {
        AppUser authUser = AppUser.builder().userId("id").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(authUser);

        mockMvc.perform(
                MockMvcRequestBuilders.multipart(BASE_PATH + "/upload")
            )
            .andExpect(
                result -> assertTrue(result.getResolvedException() instanceof MissingServletRequestPartException))
            .andExpect(status().isBadRequest());
    }

}
