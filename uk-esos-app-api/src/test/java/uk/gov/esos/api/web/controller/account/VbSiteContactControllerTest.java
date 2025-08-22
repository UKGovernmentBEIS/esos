package uk.gov.esos.api.web.controller.account;

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
import org.springframework.format.support.FormattingConversionService;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.esos.api.account.domain.dto.AccountContactDTO;
import uk.gov.esos.api.account.domain.dto.AccountContactVbInfoDTO;
import uk.gov.esos.api.account.domain.dto.AccountContactVbInfoResponse;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.account.service.AccountVbSiteContactService;
import uk.gov.esos.api.account.transform.StringToAccountTypeEnumConverter;
import uk.gov.esos.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.esos.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.esos.api.common.domain.enumeration.EmissionTradingScheme;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;
import uk.gov.esos.api.web.security.AuthorizedRoleAspect;
import uk.gov.esos.api.web.security.AppSecurityComponent;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class VbSiteContactControllerTest {

    private static final String VB_SITE_CONTACT_CONTROLLER_PATH = "/v1.0/organisation/vb-site-contacts";

    private MockMvc mockMvc;

    @InjectMocks
    private VbSiteContactController controller;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AccountVbSiteContactService service;

    @Mock
    private RoleAuthorizationService roleAuthorizationService;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

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
        controller = (VbSiteContactController) aopProxy.getProxy();

        FormattingConversionService conversionService = new FormattingConversionService();
        conversionService.addConverter(new StringToAccountTypeEnumConverter());

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
                .setControllerAdvice(new ExceptionControllerAdvice())
                .setConversionService(conversionService)
                .build();

        objectMapper = new ObjectMapper();
    }

    @Test
    void getVbSiteContacts() throws Exception {
        final AccountType accountType = AccountType.ORGANISATION;
        final AppUser user = AppUser.builder().roleType(RoleType.VERIFIER).build();

        AccountContactVbInfoResponse accountVbSiteContactInfoResponse = AccountContactVbInfoResponse.builder()
                .contacts(List.of(
                        new AccountContactVbInfoDTO(1L, "accountName1", EmissionTradingScheme.UK_ETS_INSTALLATIONS, "userId1"),
                        new AccountContactVbInfoDTO(2L, "accountName2", EmissionTradingScheme.EU_ETS_INSTALLATIONS, "userId2")
                    ))
                .editable(false).build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(service.getAccountsAndVbSiteContacts(user, accountType, 0, 2)).thenReturn(accountVbSiteContactInfoResponse);

        mockMvc.perform(MockMvcRequestBuilders.get(VB_SITE_CONTACT_CONTROLLER_PATH + "?page=0&size=2")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andExpect(jsonPath("contacts[0].accountId").value(1L))
                .andExpect(jsonPath("contacts[0].accountName").value("accountName1"))
                .andExpect(jsonPath("contacts[0].type").value("UK ETS Installations"))
                .andExpect(jsonPath("contacts[0].userId").value("userId1"))
                .andExpect(jsonPath("contacts[1].accountId").value(2L))
                .andExpect(jsonPath("contacts[1].accountName").value("accountName2"))
                .andExpect(jsonPath("contacts[1].type").value("EU ETS Installations"))
                .andExpect(jsonPath("contacts[1].userId").value("userId2"));

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verify(service, times(1)).getAccountsAndVbSiteContacts(user, accountType,0, 2);
    }

    @Test
    void getVbSiteContacts_forbidden() throws Exception {
        final AppUser user = AppUser.builder().roleType(RoleType.VERIFIER).build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(roleAuthorizationService)
                .evaluate(user, new RoleType[] {RoleType.VERIFIER}, true);

        mockMvc.perform(MockMvcRequestBuilders.get(VB_SITE_CONTACT_CONTROLLER_PATH + "?page=0&size=2")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verify(service, never()).getAccountsAndVbSiteContacts(any(), any(), anyInt(), anyInt());
    }

    @Test
    void updateVbSiteContacts() throws Exception {
        final AccountType accountType = AccountType.ORGANISATION;
        final AppUser user = AppUser.builder().roleType(RoleType.VERIFIER).build();
        List<AccountContactDTO> accountVbSiteContacts = List.of(
                AccountContactDTO.builder().accountId(1L).userId("userId1").build(),
                AccountContactDTO.builder().accountId(2L).userId("userId2").build()
        );

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
//        when(applicationConversionService.convert("INSTALLATION", AccountType.class)).thenReturn(accountType);

        mockMvc.perform(MockMvcRequestBuilders.post(VB_SITE_CONTACT_CONTROLLER_PATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(accountVbSiteContacts)))
                .andExpect(status().isNoContent());

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verify(service, times(1)).updateVbSiteContacts(user, accountType, accountVbSiteContacts);
    }

    @Test
    void updateVbSiteContacts_forbidden() throws Exception {
        final AppUser user = AppUser.builder().roleType(RoleType.VERIFIER).build();
        List<AccountContactDTO> accountVbSiteContacts = List.of(
                AccountContactDTO.builder().accountId(1L).userId("userId1").build(),
                AccountContactDTO.builder().accountId(2L).userId("userId2").build()
        );

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(appUserAuthorizationService)
                .authorize(user, "updateVbSiteContacts");

        mockMvc.perform(MockMvcRequestBuilders.post(VB_SITE_CONTACT_CONTROLLER_PATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(accountVbSiteContacts)))
                .andExpect(status().isForbidden());

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verify(service, never()).updateVbSiteContacts(any(), any(), anyList());
    }
}
