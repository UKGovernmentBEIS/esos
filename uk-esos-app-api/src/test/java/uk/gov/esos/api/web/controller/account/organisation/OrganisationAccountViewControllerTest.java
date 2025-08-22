package uk.gov.esos.api.web.controller.account.organisation;

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
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountQueryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.security.AppSecurityComponent;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountViewControllerTest {

    private static final String ACCOUNT_CONTROLLER_PATH = "/v1.0/organisation/account";
    private MockMvc mockMvc;

    @InjectMocks
    private OrganisationAccountViewController controller;

    @Mock
    private OrganisationAccountQueryService organisationAccountQueryService;

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

        controller = (OrganisationAccountViewController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .addFilters(new FilterChainProxy(Collections.emptyList()))
                .setControllerAdvice(new ExceptionControllerAdvice())
                .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
                .build()
        ;
    }

    @Test
    void getOrganisationAccountById() throws Exception {
        final long accountId = 1L;
        final AppUser user = AppUser.builder().userId("userId").roleType(RoleType.REGULATOR).build();
        final OrganisationAccountDTO organisationAccountDTO = OrganisationAccountDTO.builder()
                .id(accountId)
                .registrationNumber("registrationNbr")
                .name("accName")
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .competentAuthority(CompetentAuthorityEnum.WALES)
                .organisationId(String.valueOf(accountId))
                .status(OrganisationAccountStatus.LIVE)
                .editable(false)
                .build();

        when(organisationAccountQueryService.getOrganisationAccount(user, accountId)).thenReturn(organisationAccountDTO);
        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.get(ACCOUNT_CONTROLLER_PATH + "/" + accountId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.registrationNumber").value("registrationNbr"))
                .andExpect(jsonPath("$.name").value("accName"))
                .andExpect(jsonPath("$.line1").value("line1"))
                .andExpect(jsonPath("$.line2").value("line2"))
                .andExpect(jsonPath("$.city").value("city"))
                .andExpect(jsonPath("$.county").value("county"))
                .andExpect(jsonPath("$.postcode").value("postcode"))
                .andExpect(jsonPath("$.competentAuthority").value(CompetentAuthorityEnum.WALES.name()))
                .andExpect(jsonPath("$.organisationId").value(String.valueOf(accountId)))
                .andExpect(jsonPath("$.status").value(OrganisationAccountStatus.LIVE.name()))
                .andExpect(jsonPath("$.editable").value(false));

        verify(organisationAccountQueryService, times(1)).getOrganisationAccount(user, accountId);
    }

    @Test
    void getOrganisationAccountById_forbidden() throws Exception {
        final long accountId = 1L;
        final AppUser user = AppUser.builder().userId("userId").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(appUserAuthorizationService)
                .authorize(user, "getOrganisationAccountById", Long.toString(accountId));

        mockMvc.perform(MockMvcRequestBuilders.get(ACCOUNT_CONTROLLER_PATH + "/" + accountId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verify(organisationAccountQueryService, never()).getOrganisationAccountById(anyLong());
    }
}
