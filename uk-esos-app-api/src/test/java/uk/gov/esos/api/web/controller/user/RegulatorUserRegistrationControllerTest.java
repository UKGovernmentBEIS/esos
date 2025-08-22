package uk.gov.esos.api.web.controller.user;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

import com.fasterxml.jackson.databind.ObjectMapper;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.esos.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.esos.api.user.core.domain.dto.TokenDTO;
import uk.gov.esos.api.user.regulator.service.RegulatorUserAcceptInvitationService;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.security.AppSecurityComponent;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;
import uk.gov.esos.api.web.security.AuthorizedRoleAspect;

@ExtendWith(MockitoExtension.class)
class RegulatorUserRegistrationControllerTest {

	private static final String BASE_PATH = "/v1.0/regulator-users/registration";

	private MockMvc mockMvc;

	@InjectMocks
	private RegulatorUserRegistrationController controller;

	@Mock
	private AppSecurityComponent appSecurityComponent;

	@Mock
	private AppUserAuthorizationService appUserAuthorizationService;

	@Mock
	private RegulatorUserAcceptInvitationService regulatorUserAcceptInvitationService;

	@Mock
	private RoleAuthorizationService roleAuthorizationService;

	private ObjectMapper objectMapper;

	@BeforeEach
	public void setUp() {
		objectMapper = new ObjectMapper();

		AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(
				appSecurityComponent);
		AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);

		AuthorizedRoleAspect authorizedRoleAspect = new AuthorizedRoleAspect(roleAuthorizationService,
				authorizationAspectUserResolver);

		AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
		aspectJProxyFactory.addAspect(aspect);
		aspectJProxyFactory.addAspect(authorizedRoleAspect);

		DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
		AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);

		controller = (RegulatorUserRegistrationController) aopProxy.getProxy();

		mockMvc = MockMvcBuilders.standaloneSetup(controller)
				.setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
				.setControllerAdvice(new ExceptionControllerAdvice()).build();
	}

	@Test
	void acceptRegulatorInvitationAndRegister() throws Exception {
		AppUser currentUser = AppUser.builder().userId("authId").build();
		TokenDTO invitationTokenDTO  =TokenDTO.builder().token("token").build();
		
		when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);

		mockMvc.perform(MockMvcRequestBuilders.post(BASE_PATH + "/accept-invitation-and-register")
				.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(invitationTokenDTO)))
				.andExpect(status().isOk());

		verify(regulatorUserAcceptInvitationService, times(1)).acceptInvitationAndRegister(currentUser, invitationTokenDTO);
	}
	
}