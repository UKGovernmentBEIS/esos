package uk.gov.esos.api.web.controller.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matchers;
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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.MimeTypeUtils;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.esos.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.token.FileToken;
import uk.gov.esos.api.user.core.service.UserSignatureService;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserDTO;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserUpdateDTO;
import uk.gov.esos.api.user.regulator.service.RegulatorUserManagementService;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.orchestrator.authorization.service.RegulatorUserAuthorityUpdateOrchestrator;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;
import uk.gov.esos.api.web.security.AuthorizedRoleAspect;
import uk.gov.esos.api.web.security.AppSecurityComponent;

import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.MANAGE_USERS_AND_CONTACTS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel.NONE;

@ExtendWith(MockitoExtension.class)
class RegulatorUserManagementControllerTest {

    public static final String BASE_PATH = "/v1.0/regulator-users";

    private MockMvc mockMvc;

    @InjectMocks
    private RegulatorUserManagementController controller;

    @Mock
    private AppSecurityComponent appSecurityComponent;

	@Mock
	private AppUserAuthorizationService appUserAuthorizationService;

	@Mock
	private RegulatorUserAuthorityUpdateOrchestrator regulatorUserAuthorityUpdateOrchestrator;

    @Mock
    private RegulatorUserManagementService regulatorUserManagementService;
    
    @Mock
    private UserSignatureService userSignatureService;
    
    @Mock
    private RoleAuthorizationService roleAuthorizationService;
    
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
    	objectMapper = new ObjectMapper();

        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);
        
        AuthorizedRoleAspect authorizedRoleAspect = new AuthorizedRoleAspect(roleAuthorizationService, authorizationAspectUserResolver);

		AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
		aspectJProxyFactory.addAspect(aspect);
		aspectJProxyFactory.addAspect(authorizedRoleAspect);

		DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
		AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);

		controller = (RegulatorUserManagementController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
				.setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            	.setControllerAdvice(new ExceptionControllerAdvice())
            	.build();
    }

	@Test
	void getRegulatorUserByCaAndId() throws Exception {
		final String userId = "userId";
		AppUser currentUser = AppUser.builder().userId("currentuser").build();
		RegulatorUserDTO regulator = RegulatorUserDTO.builder()
				.firstName("firstName")
				.lastName("lastName")
				.email("email")
				.jobTitle("jobTitle")
				.build();

		when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);
		when(regulatorUserManagementService.getRegulatorUserByUserId(currentUser, userId))
				.thenReturn(regulator);

		//invoke
		mockMvc.perform(
				MockMvcRequestBuilders.get(BASE_PATH + "/" + userId)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.firstName").value(regulator.getFirstName()))
				.andExpect(jsonPath("$.lastName").value(regulator.getLastName()))
				.andExpect(jsonPath("$.email").value(regulator.getEmail()))
				.andExpect(jsonPath("$.jobTitle").value(regulator.getJobTitle()));

		verify(regulatorUserManagementService, times(1)).getRegulatorUserByUserId(currentUser, userId);
	}

	@Test
	void getRegulatorUserByCaAndId_forbidden() throws Exception {
		final String userId = "userId";
		AppUser currentUser = AppUser.builder().userId("currentuser").build();

		when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);
		doThrow(new BusinessException(ErrorCode.FORBIDDEN))
				.when(appUserAuthorizationService)
				.authorize(currentUser, "getRegulatorUserByCaAndId");

		//invoke
		mockMvc.perform(
				MockMvcRequestBuilders.get(BASE_PATH + "/" + userId)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden());

		verify(regulatorUserManagementService, never()).getRegulatorUserByUserId(any(), anyString());
	}

	@Test
	void getRegulatorUserByCaAndId_bad_request() throws Exception {
		final String userId = "userId";
		AppUser currentUser = AppUser.builder().userId("currentuser").build();

		when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);
		when(regulatorUserManagementService.getRegulatorUserByUserId(currentUser, userId))
				.thenThrow(new BusinessException(ErrorCode.AUTHORITY_USER_NOT_RELATED_TO_CA));

		//invoke
		mockMvc.perform(
				MockMvcRequestBuilders.get(BASE_PATH + "/" + userId)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest());

		verify(regulatorUserManagementService, times(1)).getRegulatorUserByUserId(currentUser, userId);
	}

	@Test
	void updateRegulatorUserByCaAndId() throws Exception {
		final String userId = "userId";
		AppUser currentUser = AppUser.builder().userId("currentuser").build();
		RegulatorUserUpdateDTO regulatorUserUpdateDTO = buildRegulatorUserUpdateDTO();
		MockMultipartFile regulatorUserUpdateDTORequestPart = new MockMultipartFile(
                "regulatorUserUpdateDTO", 
                "",
                MimeTypeUtils.APPLICATION_JSON_VALUE, 
                objectMapper.writeValueAsString(regulatorUserUpdateDTO).getBytes());
		
		String originalFilename = "filename.txt";
        String contentType = MimeTypeUtils.TEXT_PLAIN_VALUE;
        byte[] fileContent = "content".getBytes();
        MockMultipartFile signatureRequestPart = new MockMultipartFile("signature", originalFilename, contentType, fileContent);

		when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);

		//invoke
        mockMvc
            .perform(MockMvcRequestBuilders.multipart(BASE_PATH + "/" + userId)
                    .file(regulatorUserUpdateDTORequestPart)
                    .file(signatureRequestPart))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.user.firstName").value("firstName"))
            .andExpect(jsonPath("$.user.lastName").value("lastName"))
            .andExpect(jsonPath("$.permissions", Matchers.hasKey(MANAGE_USERS_AND_CONTACTS.name())))
            .andExpect(jsonPath("$.permissions", Matchers.hasValue(NONE.name())));
    
        FileDTO expectedSignatureDTO = FileDTO.builder()
                .fileName(originalFilename)
                .fileType(contentType)
                .fileContent(fileContent)
                .fileSize(fileContent.length)
                .build();

		verify(regulatorUserAuthorityUpdateOrchestrator, times(1))
			.updateRegulatorUserByUserId(currentUser, userId, regulatorUserUpdateDTO, expectedSignatureDTO);
	}

	@Test
	void updateRegulatorUserByCaAndId_forbidden() throws Exception {
	    final String userId = "userId";
        AppUser currentUser = AppUser.builder().userId("currentuser").build();
        RegulatorUserUpdateDTO regulatorUserUpdateDTO = buildRegulatorUserUpdateDTO();
        MockMultipartFile regulatorUserUpdateDTORequestPart = new MockMultipartFile(
                "regulatorUserUpdateDTO", 
                "",
                MimeTypeUtils.APPLICATION_JSON_VALUE, 
                objectMapper.writeValueAsString(regulatorUserUpdateDTO).getBytes());
        
        String originalFilename = "filename.txt";
        String contentType = MimeTypeUtils.TEXT_PLAIN_VALUE;
        byte[] fileContent = "content".getBytes();
        MockMultipartFile signatureRequestPart = new MockMultipartFile("signature", originalFilename, contentType, fileContent);

		when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);
		doThrow(new BusinessException(ErrorCode.FORBIDDEN))
				.when(appUserAuthorizationService)
				.authorize(currentUser, "updateRegulatorUserByCaAndId");

		//invoke
		mockMvc.perform(MockMvcRequestBuilders.multipart(BASE_PATH + "/" + userId)
                        .file(regulatorUserUpdateDTORequestPart)
                        .file(signatureRequestPart))
				.andExpect(status().isForbidden());

		verifyNoInteractions(regulatorUserAuthorityUpdateOrchestrator);
	}

	@Test
	void updateCurrentRegulatorUser() throws Exception {
		AppUser currentUser = AppUser.builder().userId("currentuser").build();
		RegulatorUserUpdateDTO regulatorUserUpdateDTO = buildRegulatorUserUpdateDTO();
		MockMultipartFile regulatorUserUpdateDTORequestPart = new MockMultipartFile(
                "regulatorUserUpdateDTO", 
                "",
                MimeTypeUtils.APPLICATION_JSON_VALUE, 
                objectMapper.writeValueAsString(regulatorUserUpdateDTO).getBytes());
		
		String originalFilename = "filename.txt";
        String contentType = MimeTypeUtils.TEXT_PLAIN_VALUE;
        byte[] fileContent = "content".getBytes();
        MockMultipartFile signatureRequestPart = new MockMultipartFile("signature", originalFilename, contentType, fileContent);

		when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);

		// Invoke
		mockMvc.perform(MockMvcRequestBuilders.multipart(BASE_PATH)
                .file(regulatorUserUpdateDTORequestPart)
                .file(signatureRequestPart))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.user.firstName").value("firstName"))
			.andExpect(jsonPath("$.user.lastName").value("lastName"))
			.andExpect(jsonPath("$.permissions", Matchers.hasKey(MANAGE_USERS_AND_CONTACTS.name())))
			.andExpect(jsonPath("$.permissions", Matchers.hasValue(NONE.name())));

		FileDTO expectedSignatureDTO = FileDTO.builder()
                .fileName(originalFilename)
                .fileType(contentType)
                .fileContent(fileContent)
                .fileSize(fileContent.length)
                .build();
		verify(regulatorUserAuthorityUpdateOrchestrator, times(1))
			.updateRegulatorUserByUserId(currentUser, currentUser.getUserId(), regulatorUserUpdateDTO, expectedSignatureDTO);
	}

	@Test
	void updateCurrentRegulatorUser_forbidden() throws Exception {
		AppUser currentUser = AppUser.builder().userId("currentuser").build();
		RegulatorUserUpdateDTO regulatorUserUpdateDTO = buildRegulatorUserUpdateDTO();
		MockMultipartFile regulatorUserUpdateDTORequestPart = new MockMultipartFile(
                "regulatorUserUpdateDTO", 
                "",
                MimeTypeUtils.APPLICATION_JSON_VALUE, 
                objectMapper.writeValueAsString(regulatorUserUpdateDTO).getBytes());
        
        String originalFilename = "filename.txt";
        String contentType = MimeTypeUtils.TEXT_PLAIN_VALUE;
        byte[] fileContent = "content".getBytes();
        MockMultipartFile signatureRequestPart = new MockMultipartFile("signature", originalFilename, contentType, fileContent);


		when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);
		doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(roleAuthorizationService)
            .evaluate(currentUser, new RoleType[] {RoleType.REGULATOR}, true);

		//invoke
		mockMvc.perform(MockMvcRequestBuilders.multipart(BASE_PATH)
                    .file(regulatorUserUpdateDTORequestPart)
                    .file(signatureRequestPart))
				.andExpect(status().isForbidden());

		verifyNoInteractions(regulatorUserAuthorityUpdateOrchestrator);
	}
	
	@Test
    void generateGetRegulatorSignatureToken() throws Exception {
	    String userId = "userId";
        UUID signatureUuid = UUID.randomUUID();
        FileToken fileToken = FileToken.builder().token("token").tokenExpirationMinutes(10L).build();

        when(userSignatureService.generateSignatureFileToken(userId, signatureUuid)).thenReturn(fileToken);

        mockMvc.perform(MockMvcRequestBuilders
                .get(BASE_PATH + "/" + userId + "/signature")
                .param("signatureUuid", signatureUuid.toString())
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value(fileToken.getToken()))
            .andExpect(jsonPath("$.tokenExpirationMinutes").value(fileToken.getTokenExpirationMinutes()));

        verify(userSignatureService, times(1))
            .generateSignatureFileToken(userId, signatureUuid);
    }
	
	@Test
    void generateGetRegulatorSignatureToken_forbidden() throws Exception {
	    AppUser currentUser = AppUser.builder().userId("currentuser").build();
        String userId = "userId";
        UUID signatureUuid = UUID.randomUUID();
        
        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);

        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
        .when(appUserAuthorizationService)
        .authorize(currentUser, "generateGetRegulatorSignatureToken");

        mockMvc.perform(MockMvcRequestBuilders
                .get(BASE_PATH + "/" + userId + "/signature")
                .param("signatureUuid", signatureUuid.toString())
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());

        verifyNoInteractions(userSignatureService);
    }
	
	@Test
	void resetRegulator2Fa() throws Exception {
		final String userId = "userId";
		AppUser currentUser = AppUser.builder().userId("currentuser").build();

		when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);

		//invoke
        mockMvc
            .perform(MockMvcRequestBuilders.multipart(BASE_PATH + "/" + userId + "/reset-2fa"))
            .andExpect(status().isOk());

		verify(regulatorUserManagementService, times(1)).resetRegulator2Fa(currentUser, userId);
	}

	@Test
	void resetRegulator2Fa_forbidden() throws Exception {
	    final String userId = "userId";
        AppUser currentUser = AppUser.builder().userId("currentuser").build();

		when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);
		doThrow(new BusinessException(ErrorCode.FORBIDDEN))
				.when(appUserAuthorizationService)
				.authorize(currentUser, "resetRegulator2Fa");

		//invoke
		mockMvc.perform(MockMvcRequestBuilders.multipart(BASE_PATH + "/" + userId + "/reset-2fa"))
				.andExpect(status().isForbidden());

		verify(regulatorUserManagementService, never()).resetRegulator2Fa( any(), anyString());
	}
	
    private RegulatorUserUpdateDTO buildRegulatorUserUpdateDTO() {
		return RegulatorUserUpdateDTO.builder()
				.user(RegulatorUserDTO.builder()
						.firstName("firstName")
						.lastName("lastName")
						.email("email@email.com")
						.jobTitle("jobTitle")
						.phoneNumber("2101313131")
						.build())
			.permissions(Map.of(MANAGE_USERS_AND_CONTACTS, NONE))
			.build();
	}
}
