package uk.gov.esos.api.web.controller.account.organisation;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.hibernate.validator.HibernateValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.context.support.GenericWebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountUpdateDTO;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountUpdateService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.ClassificationType;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.controller.utils.TestConstrainValidatorFactory;
import uk.gov.esos.api.web.security.AppSecurityComponent;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountUpdateControllerTest {

	private static final String CONTROLLER_PATH = "/v1.0/organisation/accounts";

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @InjectMocks
    private OrganisationAccountUpdateController controller;

    @Mock
    private OrganisationAccountUpdateService organisationAccountUpdateService;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;


    @BeforeEach
    public void setUp() {
        AuthorizationAspectUserResolver authorizationAspectUserResolver =
                new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
        aspectJProxyFactory.addAspect(aspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);
        controller = (OrganisationAccountUpdateController) aopProxy.getProxy();

        LocalValidatorFactoryBean validatorFactoryBean = mockValidatorFactoryBean();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
                .setControllerAdvice(new ExceptionControllerAdvice())
                .setValidator(validatorFactoryBean)
                .build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    private LocalValidatorFactoryBean mockValidatorFactoryBean() {
        LocalValidatorFactoryBean validatorFactoryBean = new LocalValidatorFactoryBean();
        MockServletContext servletContext = new MockServletContext();
        GenericWebApplicationContext context = new GenericWebApplicationContext(servletContext);

        context.refresh();
        validatorFactoryBean.setApplicationContext(context);
        TestConstrainValidatorFactory constraintValidatorFactory = new TestConstrainValidatorFactory(context);
        validatorFactoryBean.setConstraintValidatorFactory(constraintValidatorFactory);
        validatorFactoryBean.setProviderClass(HibernateValidator.class);
        validatorFactoryBean.afterPropertiesSet();
        return validatorFactoryBean;
    }

    @Test
    void updateOrganisationAccount() throws Exception {
        AppUser user = AppUser.builder().build();
        Long accountId = 1L;
        OrganisationAccountUpdateDTO accountUpdateDTO = OrganisationAccountUpdateDTO.builder()
                .name("name")
                .codes(buildClassificationCodes())
                .address(buildAddress())
                .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(
                        MockMvcRequestBuilders
                                .post(CONTROLLER_PATH + "/" + accountId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(accountUpdateDTO)))
                .andExpect(status().isNoContent());

        verify(organisationAccountUpdateService, times(1)).updateOrganisationAccount(accountId, accountUpdateDTO);
    }

	@Test
    void updateOrganisationAccount_forbidden() throws Exception {
        AppUser user = AppUser.builder().build();
        Long accountId = 1L;

        OrganisationAccountUpdateDTO accountUpdateDTO = OrganisationAccountUpdateDTO.builder()
                .name("name")
                .codes(buildClassificationCodes())
                .address(buildAddress())
                .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(appUserAuthorizationService)
                .authorize(user, "updateOrganisationAccount", String.valueOf(accountId));

        mockMvc.perform(
                        MockMvcRequestBuilders
                                .post(CONTROLLER_PATH + "/" + accountId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(accountUpdateDTO)))
                .andExpect(status().isForbidden());

        verify(organisationAccountUpdateService, never())
                .updateOrganisationAccount(Mockito.anyLong(), any(OrganisationAccountUpdateDTO.class));
    }
	
	private CountyAddressDTO buildAddress() {
		return CountyAddressDTO.builder()
				.county("county")
				.line1("line1")
				.postcode("postcode")
				.city("city")
				.build();
	}

	private ClassificationCodes buildClassificationCodes() {
		return ClassificationCodes.builder()
				.type(ClassificationType.SIC)
				.codes(List.of("code1", "code2"))
				.build();
	}
}
