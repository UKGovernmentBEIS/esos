package uk.gov.esos.api.web.controller.authorization;

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
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.regulator.domain.RegulatorUserUpdateStatusDTO;
import uk.gov.esos.api.authorization.regulator.service.RegulatorAuthorityDeletionService;
import uk.gov.esos.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.esos.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.orchestrator.authorization.service.RegulatorUserAuthorityQueryOrchestrator;
import uk.gov.esos.api.web.orchestrator.authorization.service.RegulatorUserAuthorityUpdateOrchestrator;
import uk.gov.esos.api.web.orchestrator.authorization.dto.RegulatorUserAuthorityInfoDTO;
import uk.gov.esos.api.web.orchestrator.authorization.dto.RegulatorUsersAuthoritiesInfoDTO;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;
import uk.gov.esos.api.web.security.AuthorizedRoleAspect;
import uk.gov.esos.api.web.security.AppSecurityComponent;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class RegulatorAuthorityControllerTest {

    private static final String BASE_PATH = "/v1.0/regulator-authorities";

    private MockMvc mockMvc;

    @InjectMocks
    private RegulatorAuthorityController regulatorAuthorityController;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private RoleAuthorizationService roleAuthorizationService;

    @Mock
    private RegulatorAuthorityDeletionService regulatorAuthorityDeletionService;

    @Mock
    private RegulatorUserAuthorityQueryOrchestrator regulatorUserAuthorityQueryOrchestrator;

    @Mock
    private RegulatorUserAuthorityUpdateOrchestrator regulatorUserAuthorityUpdateOrchestrator;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);
        AuthorizedRoleAspect authorizedRoleAspect = new AuthorizedRoleAspect(roleAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(regulatorAuthorityController);
        aspectJProxyFactory.addAspect(aspect);
        aspectJProxyFactory.addAspect(authorizedRoleAspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);

        regulatorAuthorityController = (RegulatorAuthorityController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(regulatorAuthorityController)
                .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
                .setControllerAdvice(new ExceptionControllerAdvice())
                .build();

        objectMapper = new ObjectMapper();
    }

    @Test
    void updateCompetentAuthorityRegulatorUsersStatus() throws Exception {
        AppUser currentUser = AppUser.builder().userId("currentuser").build();

        List<RegulatorUserUpdateStatusDTO> regulatorUsers = List.of(
            RegulatorUserUpdateStatusDTO.builder().userId("user1").authorityStatus(AuthorityStatus.DISABLED).build(),
            RegulatorUserUpdateStatusDTO.builder().userId("user2").authorityStatus(AuthorityStatus.DISABLED).build()
        );

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);

        //invoke
        mockMvc.perform(
            MockMvcRequestBuilders.post(BASE_PATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regulatorUsers))
        )
            .andExpect(status().isNoContent());

        verify(regulatorUserAuthorityUpdateOrchestrator, times(1))
            .updateRegulatorUsersStatus(regulatorUsers, currentUser);
    }

    @Test
    void updateCompetentAuthorityRegulatorUsersStatus_forbidden() throws Exception {
        AppUser currentUser = AppUser.builder().userId("currentuser").build();

        List<RegulatorUserUpdateStatusDTO> regulatorUsers = List.of(
            RegulatorUserUpdateStatusDTO.builder().userId("user1").authorityStatus(AuthorityStatus.DISABLED).build(),
            RegulatorUserUpdateStatusDTO.builder().userId("user2").authorityStatus(AuthorityStatus.DISABLED).build()
        );

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(currentUser, "updateCompetentAuthorityRegulatorUsersStatus");

        //invoke
        mockMvc.perform(
            MockMvcRequestBuilders.post(BASE_PATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regulatorUsers))
        )
            .andExpect(status().isForbidden());

        verify(regulatorUserAuthorityUpdateOrchestrator, never()).updateRegulatorUsersStatus(anyList(), any());
    }

    @Test
    void deleteRegulatorUserByCompetentAuthority() throws Exception {
        final AppUser currentUser = AppUser.builder().userId("currentuser").build();
        final String user = "user";

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);

        //invoke
        mockMvc.perform(
            MockMvcRequestBuilders.delete(BASE_PATH + "/" + user)
        )
            .andExpect(status().isNoContent());

        verify(regulatorAuthorityDeletionService, times(1))
            .deleteRegulatorUser(user, currentUser);
    }

    @Test
    void deleteRegulatorUserByCompetentAuthority_forbidden() throws Exception {
        final AppUser currentUser = AppUser.builder().userId("currentuser").build();
        final String user = "user";

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(currentUser, "deleteRegulatorUserByCompetentAuthority");

        //invoke
        mockMvc.perform(
            MockMvcRequestBuilders.delete(BASE_PATH + "/" + user)
        )
            .andExpect(status().isForbidden());

        verify(regulatorAuthorityDeletionService, never()).deleteRegulatorUser(anyString(), any());
    }

    @Test
    void deleteCurrentRegulatorUserByCompetentAuthority() throws Exception {
        final AppUser currentUser = AppUser.builder().userId("currentuser").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);

        //invoke
        mockMvc.perform(
            MockMvcRequestBuilders.delete(BASE_PATH)
        )
            .andExpect(status().isNoContent());

        verify(regulatorAuthorityDeletionService, times(1)).deleteCurrentRegulatorUser(currentUser);
    }

    @Test
    void deleteCurrentRegulatorUserByCompetentAuthority_forbidden() throws Exception {
        final AppUser currentUser = AppUser.builder().userId("currentuser").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(currentUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(currentUser, "deleteCurrentRegulatorUserByCompetentAuthority");

        //invoke
        mockMvc.perform(
            MockMvcRequestBuilders.delete(BASE_PATH)
        )
            .andExpect(status().isForbidden());

        verify(regulatorAuthorityDeletionService, never()).deleteCurrentRegulatorUser(any());
    }

    @Test
    void getCaRegulators_no_users() throws Exception {
        AppUser authUser = buildRegulatorUser();

        //mock
        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(authUser);
        when(regulatorUserAuthorityQueryOrchestrator.getCaUsersAuthoritiesInfo(authUser))
            .thenReturn(buildRegulatorUsersAuthoritiesInfoDTO(Collections.emptyList()));

        //invoke
        mockMvc.perform(
            MockMvcRequestBuilders.get(BASE_PATH)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("caUsers").isEmpty());
    }

    @Test
    void getCaRegulators_no_permission() throws Exception {
        AppUser authUser = buildRegulatorUser();

        //mock
        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(authUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(roleAuthorizationService)
            .evaluate(authUser, new RoleType[] {RoleType.REGULATOR}, true);

        //invoke
        mockMvc.perform(
            MockMvcRequestBuilders.get(BASE_PATH)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    void getCaRegulators() throws Exception {
        AppUser authUser = buildRegulatorUser();
        RegulatorUserAuthorityInfoDTO caRegulatorUserManageDTO = buildRegulatorUserAuthorityInfoDTO();

        //mock
        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(authUser);
        when(regulatorUserAuthorityQueryOrchestrator.getCaUsersAuthoritiesInfo(authUser))
            .thenReturn(buildRegulatorUsersAuthoritiesInfoDTO(List.of(buildRegulatorUserAuthorityInfoDTO())));

        //invoke
        mockMvc.perform(
            MockMvcRequestBuilders.get(BASE_PATH)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("caUsers").isNotEmpty())
            .andExpect(jsonPath("caUsers[0].userId").value(caRegulatorUserManageDTO.getUserId()))
            .andExpect(jsonPath("caUsers[0].firstName").value(caRegulatorUserManageDTO.getFirstName()))
            .andExpect(jsonPath("caUsers[0].lastName").value(caRegulatorUserManageDTO.getLastName()))
            .andExpect(jsonPath("caUsers[0].jobTitle").value(caRegulatorUserManageDTO.getJobTitle()));
    }

    private AppUser buildRegulatorUser() {
        return AppUser.builder()
                .userId("userId")
                .roleType(RoleType.REGULATOR)
                .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build()))
                .build();
    }

    private RegulatorUserAuthorityInfoDTO buildRegulatorUserAuthorityInfoDTO() {

        return RegulatorUserAuthorityInfoDTO.builder()
            .firstName("firstName")
            .lastName("lastName")
            .jobTitle("jobTitle")
            .build();
    }

    private RegulatorUsersAuthoritiesInfoDTO buildRegulatorUsersAuthoritiesInfoDTO(List<RegulatorUserAuthorityInfoDTO> users) {
        return RegulatorUsersAuthoritiesInfoDTO.builder()
            .caUsers(users)
            .editable(false)
            .build();
    }
}
