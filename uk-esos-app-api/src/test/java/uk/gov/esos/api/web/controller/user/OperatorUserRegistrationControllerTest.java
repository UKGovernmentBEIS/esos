package uk.gov.esos.api.web.controller.user;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.validation.Validator;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.esos.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.esos.api.user.core.domain.dto.TokenDTO;
import uk.gov.esos.api.user.operator.domain.OperatorInvitedUserInfoDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserInviteAndRegisterDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserRegistrationDTO;
import uk.gov.esos.api.user.operator.service.OperatorUserAcceptInvitationService;
import uk.gov.esos.api.user.operator.service.OperatorUserRegistrationService;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.security.AppSecurityComponent;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;
import uk.gov.esos.api.web.security.AuthorizedRoleAspect;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class OperatorUserRegistrationControllerTest {

	public static final String BASE_PATH = "/v1.0/operator-users/registration";

    private MockMvc mockMvc;

    @InjectMocks
    private OperatorUserRegistrationController controller;

    @Mock
    private AppSecurityComponent appSecurityComponent;
    
    @Mock
    private OperatorUserRegistrationService operatorUserRegistrationService;

    @Mock
    private OperatorUserAcceptInvitationService operatorUserAcceptInvitationService;
    
    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private RoleAuthorizationService roleAuthorizationService;
    
    @Mock
    private Validator validator;
    
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
    	AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);
        AuthorizedRoleAspect authorizedRoleAspect = new AuthorizedRoleAspect(roleAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
        aspectJProxyFactory.addAspect(aspect);
        aspectJProxyFactory.addAspect(authorizedRoleAspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);

        controller = (OperatorUserRegistrationController) aopProxy.getProxy();
    	objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
				.setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
				.setValidator(validator)
            	.setControllerAdvice(new ExceptionControllerAdvice())
            	.build();
    }

    @Test
	void registerCurrentOperatorUser() throws Exception {
		AppUser currentUser = AppUser.builder().userId("authId").build();
		OperatorUserRegistrationDTO userRegistrationDTO = OperatorUserRegistrationDTO
				.builder().firstName("fn").lastName("ln").build();
		OperatorUserDTO userDTO = OperatorUserDTO.builder().email("email").firstName("fn").lastName("ln").build();
		
		
		when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);
		when(operatorUserRegistrationService.registerUser(userRegistrationDTO, currentUser)).thenReturn(userDTO);

		mockMvc.perform(MockMvcRequestBuilders.post(BASE_PATH + "/register")
				.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(userRegistrationDTO)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value("email"));

		verify(operatorUserRegistrationService, times(1)).registerUser(userRegistrationDTO, currentUser);
	}
	
	@Test
	void acceptOperatorInvitationAndRegister() throws Exception {
		AppUser currentUser = AppUser.builder().userId("authId").build();
		OperatorUserInviteAndRegisterDTO operatorUserInviteAndRegisterDTO = OperatorUserInviteAndRegisterDTO
				.builder()
				.operatorUserRegistrationDTO(OperatorUserRegistrationDTO.builder().firstName("fn").lastName("ln").build())
				.invitationTokenDTO(TokenDTO.builder().token("token").build())
				.build();
		
		when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);
		when(operatorUserAcceptInvitationService.acceptInvitationAndRegister(currentUser,
				operatorUserInviteAndRegisterDTO)).thenReturn(OperatorInvitedUserInfoDTO.builder().accountName("acc").build());

		mockMvc.perform(MockMvcRequestBuilders.post(BASE_PATH + "/accept-invitation-and-register")
				.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(operatorUserInviteAndRegisterDTO)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.accountName").value("acc"));

		verify(operatorUserAcceptInvitationService, times(1)).acceptInvitationAndRegister(currentUser, operatorUserInviteAndRegisterDTO);
	}
	
	@Test
	void acceptOperatorInvitation() throws Exception {
		AppUser currentUser = AppUser.builder().userId("authId").build();
		TokenDTO invitationTokenDTO = TokenDTO.builder().token("token").build();
		
		when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);
		when(operatorUserAcceptInvitationService.acceptInvitation(currentUser,
				invitationTokenDTO)).thenReturn(OperatorInvitedUserInfoDTO.builder().accountName("acc").build());

		mockMvc.perform(MockMvcRequestBuilders.post(BASE_PATH + "/accept-invitation")
				.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(invitationTokenDTO)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.accountName").value("acc"));

		verify(operatorUserAcceptInvitationService, times(1)).acceptInvitation(currentUser, invitationTokenDTO);
	}
    
}