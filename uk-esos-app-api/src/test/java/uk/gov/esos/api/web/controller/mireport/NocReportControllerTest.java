package uk.gov.esos.api.web.controller.mireport;

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
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import uk.gov.esos.api.account.transform.StringToAccountTypeEnumConverter;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.reporting.noc.phase3.domain.dto.NocP3SearchResultsInfoDto;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.orchestrator.mireport.dto.NotificationOfCompliancesP3MiReportResult;
import uk.gov.esos.api.web.orchestrator.mireport.service.NotificationOfCompliancesMiReportQueryOrchestrator;
import uk.gov.esos.api.web.security.AppSecurityComponent;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedRoleAspect;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class NocReportControllerTest {

    private static final String NOC_REPORT_BASE_CONTROLLER_PATH = "/v1.0/organisation/mireports/noc";

    private MockMvc mockMvc;

    @InjectMocks
    private NocReportController nocReportController;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private RoleAuthorizationService roleAuthorizationService;

    @Mock
    private NotificationOfCompliancesMiReportQueryOrchestrator notificationOfCompliancesMiReportQueryOrchestrator;

    @BeforeEach
    public void setUp() {
        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedRoleAspect authorizedRoleAspect = new AuthorizedRoleAspect(roleAuthorizationService, authorizationAspectUserResolver);
        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(nocReportController);
        aspectJProxyFactory.addAspect(authorizedRoleAspect);
        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);
        nocReportController = (NocReportController) aopProxy.getProxy();

        FormattingConversionService conversionService = new FormattingConversionService();
        conversionService.addConverter(new StringToAccountTypeEnumConverter());

        mockMvc = MockMvcBuilders.standaloneSetup(nocReportController)
                .setControllerAdvice(new ExceptionControllerAdvice())
                .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
                .addFilters(new FilterChainProxy(Collections.emptyList()))
                .setConversionService(conversionService)
                .build();
    }

    @Test
    void generateNocP3Report() throws Exception {
        final AccountType accountType = AccountType.ORGANISATION;
        final Long page = 0L;
        final Long pageSize = 1L;
        final NotificationOfCompliancesP3MiReportResult searchResult = NotificationOfCompliancesP3MiReportResult.builder()
                .reportType(MiReportType.NOC_SUBMITTED_DATA_P3)
                .results(Map.of("NOC001", NocP3SearchResultsInfoDto.builder().build()))
                .total(1L)
                .build();
        final AppUser appUser = AppUser.builder()
                .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build()))
                .roleType(RoleType.REGULATOR)
                .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);
        when(notificationOfCompliancesMiReportQueryOrchestrator.generateP3(accountType, page, pageSize))
                .thenReturn(searchResult);

        mockMvc.perform(MockMvcRequestBuilders.get(NOC_REPORT_BASE_CONTROLLER_PATH + "/phase-3")
                        .queryParam("page", page.toString())
                        .queryParam("size", pageSize.toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reportType").value(MiReportType.NOC_SUBMITTED_DATA_P3.name()))
                .andExpect(jsonPath("$.results.NOC001").value(NocP3SearchResultsInfoDto.builder().build()))
                .andExpect(jsonPath("$.total").value(1));

        verify(notificationOfCompliancesMiReportQueryOrchestrator, times(1))
                .generateP3(accountType, page, pageSize);
    }

    @Test
    void generateNocP3Report_forbidden() throws Exception {
        final long page = 0L;
        final long pageSize = 1L;
        final AppUser appUser = AppUser.builder()
                .authorities(List.of(AppAuthority.builder().build()))
                .roleType(RoleType.OPERATOR)
                .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(roleAuthorizationService)
                .evaluate(appUser, new RoleType[]{RoleType.REGULATOR}, true);

        mockMvc.perform(MockMvcRequestBuilders.get(NOC_REPORT_BASE_CONTROLLER_PATH + "/phase-3")
                        .queryParam("page", Long.toString(page))
                        .queryParam("size", Long.toString(pageSize))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verifyNoInteractions(notificationOfCompliancesMiReportQueryOrchestrator);
    }
}
