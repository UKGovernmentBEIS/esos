package uk.gov.esos.api.authorization.rules.services.handlers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.RequestAuthorityInfoDTO;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.ResourceAuthorityInfo;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.providers.RequestAuthorityInfoProvider;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.competentauthority.CompetentAuthorityEnum.ENGLAND;

@ExtendWith(MockitoExtension.class)
class RequestAccessRuleHandlerTest {
    @InjectMocks
    private RequestAccessRuleHandler requestAccessRuleHandler;

    @Mock
    private AppAuthorizationService appAuthorizationService;

    @Mock
    private RequestAuthorityInfoProvider requestAuthorityInfoProvider;

    private final AppUser USER = AppUser.builder().roleType(RoleType.OPERATOR).build();

    @Test
    void request_does_not_exist() {
        AuthorizationRuleScopePermission authorizationRule1 = 
                AuthorizationRuleScopePermission.builder()
            .permission(Permission.PERM_ACCOUNT_USERS_EDIT)
            .build();

        when(requestAuthorityInfoProvider.getRequestInfo("1")).thenThrow(new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        Set<AuthorizationRuleScopePermission> rules = Set.of(authorizationRule1);
        BusinessException exception = assertThrows(BusinessException.class,
                () -> requestAccessRuleHandler.evaluateRules(rules, USER, "1"));

        assertEquals(ErrorCode.RESOURCE_NOT_FOUND, exception.getErrorCode());
        verifyNoMoreInteractions(appAuthorizationService);
    }

    @Test
    void single_rule() {
        AuthorizationRuleScopePermission authorizationRule1 = 
                AuthorizationRuleScopePermission.builder()
            .permission(Permission.PERM_ACCOUNT_USERS_EDIT)
            .build();

        RequestAuthorityInfoDTO requestInfoDTO = RequestAuthorityInfoDTO.builder()
                .authorityInfo(ResourceAuthorityInfo.builder()
                        .accountId(1L)
                        .competentAuthority(ENGLAND)
                        .verificationBodyId(1L).build())
                .build();
        when(requestAuthorityInfoProvider.getRequestInfo("1")).thenReturn(requestInfoDTO);

        Set<AuthorizationRuleScopePermission> rules = Set.of(authorizationRule1);
        requestAccessRuleHandler.evaluateRules(rules, USER, "1");

        AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
                .accountId(requestInfoDTO.getAuthorityInfo().getAccountId())
                .competentAuthority(requestInfoDTO.getAuthorityInfo().getCompetentAuthority())
                .verificationBodyId(requestInfoDTO.getAuthorityInfo().getVerificationBodyId())
                .permission(Permission.PERM_ACCOUNT_USERS_EDIT)
                .build();
        verify(appAuthorizationService, times(1)).authorize(USER, authorizationCriteria);
        verifyNoMoreInteractions(appAuthorizationService);
    }

    @Test
    void multiple_rules() {
        AuthorizationRuleScopePermission authorizationRule1 = 
                AuthorizationRuleScopePermission.builder()
            .permission(Permission.PERM_ACCOUNT_USERS_EDIT)
            .build();
        AuthorizationRuleScopePermission authorizationRule2 = 
                AuthorizationRuleScopePermission.builder()
            .permission(Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK)
            .build();

        RequestAuthorityInfoDTO requestInfoDTO = RequestAuthorityInfoDTO.builder()
                .authorityInfo(ResourceAuthorityInfo.builder()
                        .accountId(1L)
                        .competentAuthority(ENGLAND)
                        .verificationBodyId(1L).build())
                .build();
        when(requestAuthorityInfoProvider.getRequestInfo("1")).thenReturn(requestInfoDTO);

        Set<AuthorizationRuleScopePermission> rules = Set.of(authorizationRule1, authorizationRule2);
        requestAccessRuleHandler.evaluateRules(rules, USER, "1");

        AuthorizationCriteria authorizationCriteria1 = AuthorizationCriteria.builder()
                .accountId(requestInfoDTO.getAuthorityInfo().getAccountId())
                .competentAuthority(requestInfoDTO.getAuthorityInfo().getCompetentAuthority())
                .verificationBodyId(requestInfoDTO.getAuthorityInfo().getVerificationBodyId())
                .permission(Permission.PERM_ACCOUNT_USERS_EDIT)
                .build();
        verify(appAuthorizationService, times(1)).authorize(USER, authorizationCriteria1);

        AuthorizationCriteria authorizationCriteria2 = AuthorizationCriteria.builder()
                .accountId(requestInfoDTO.getAuthorityInfo().getAccountId())
                .competentAuthority(requestInfoDTO.getAuthorityInfo().getCompetentAuthority())
                .verificationBodyId(requestInfoDTO.getAuthorityInfo().getVerificationBodyId())
                .permission(Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK)
                .build();
        verify(appAuthorizationService, times(1)).authorize(USER, authorizationCriteria2);
        verifyNoMoreInteractions(appAuthorizationService);
    }

}
