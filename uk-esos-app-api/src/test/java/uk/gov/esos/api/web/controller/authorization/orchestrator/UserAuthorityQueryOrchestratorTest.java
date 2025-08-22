package uk.gov.esos.api.web.controller.authorization.orchestrator;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityDTO;
import uk.gov.esos.api.authorization.core.service.AuthorityService;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;
import uk.gov.esos.api.web.controller.authorization.orchestrator.dto.LoginStatus;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK;

@ExtendWith(MockitoExtension.class)
class UserAuthorityQueryOrchestratorTest {

    @InjectMocks
    private UserAuthorityQueryOrchestrator orchestrator;

    @Mock
    private UserAuthService userAuthService;

    @Mock
    private AuthorityService authorityService;

    @Test
    void getUserLoginStatusInfo_when_active_authorities_with_permissions_then_enabled() {
        final String userId = "userId";

        AuthorityDTO authority1 = createAuthority(1L, AuthorityStatus.ACTIVE);
        authority1.setAuthorityPermissions(List.of(PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK));

        when(authorityService.getAuthoritiesByUserId(userId)).thenReturn(List.of(authority1));

        // Invoke
        LoginStatus actual = orchestrator.getUserLoginStatusInfo(userId);

        // Verify
        assertThat(actual).isEqualTo(LoginStatus.ENABLED);
        verify(authorityService, times(1)).getAuthoritiesByUserId(userId);
        verify(userAuthService, never()).getUserByUserId(anyString());
    }

    @Test
    void getUserLoginStatusInfo_when_active_authorities_without_permissions_then_no_authority() {
        final String userId = "userId";

        AuthorityDTO authority1 = createAuthority(1L, AuthorityStatus.ACTIVE);

        when(authorityService.getAuthoritiesByUserId(userId)).thenReturn(List.of(authority1));

        // Invoke
        LoginStatus actual = orchestrator.getUserLoginStatusInfo(userId);

        // Verify
        assertThat(actual).isEqualTo(LoginStatus.NO_AUTHORITY);
        verify(authorityService, times(1)).getAuthoritiesByUserId(userId);
        verify(userAuthService, never()).getUserByUserId(anyString());
    }

    @Test
    void getUserLoginStatusInfo_when_two_active_authorities_only_one_with_permissions_then_enabled() {
        final String userId = "userId";

        AuthorityDTO authority1 = createAuthority(1L, AuthorityStatus.ACTIVE);
        authority1.setAuthorityPermissions(List.of(PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK));

        AuthorityDTO authority2 = createAuthority(2L, AuthorityStatus.ACTIVE);

        when(authorityService.getAuthoritiesByUserId(userId)).thenReturn(List.of(authority1, authority2));

        // Invoke
        LoginStatus actual = orchestrator.getUserLoginStatusInfo(userId);

        // Verify
        assertThat(actual).isEqualTo(LoginStatus.ENABLED);
        verify(authorityService, times(1)).getAuthoritiesByUserId(userId);
        verify(userAuthService, never()).getUserByUserId(anyString());
    }

    @Test
    void getUserLoginStatusInfo_when_nor_active_authorities_neither_temp_disabled_then_disabled() {
        final String userId = "userId";

        AuthorityDTO authority1 = createAuthority(1L, AuthorityStatus.DISABLED);
        AuthorityDTO authority2 = createAuthority(2L, AuthorityStatus.PENDING);

        when(authorityService.getAuthoritiesByUserId(userId)).thenReturn(List.of(authority1, authority2));

        // Invoke
        LoginStatus actual = orchestrator.getUserLoginStatusInfo(userId);

        // Verify
        assertThat(actual).isEqualTo(LoginStatus.DISABLED);
        verify(authorityService, times(1)).getAuthoritiesByUserId(userId);
        verify(userAuthService, never()).getUserByUserId(anyString());
    }

    @Test
    void getUserLoginStatusInfo_when_nor_active_authorities_and_accepted() {
        final String userId = "userId";

        AuthorityDTO authority = createAuthority(1L, AuthorityStatus.ACCEPTED);

        when(authorityService.getAuthoritiesByUserId(userId)).thenReturn(List.of(authority));

        // Invoke
        LoginStatus actual = orchestrator.getUserLoginStatusInfo(userId);

        // Verify
        assertThat(actual).isEqualTo(LoginStatus.ACCEPTED);
        verify(authorityService, times(1)).getAuthoritiesByUserId(userId);
        verify(userAuthService, never()).getUserByUserId(anyString());
    }

    @Test
    void getUserLoginStatusInfo_when_no_authorities() {
        final String userId = "userId";

        when(authorityService.getAuthoritiesByUserId(userId)).thenReturn(Collections.emptyList());

        // Invoke
        LoginStatus actual = orchestrator.getUserLoginStatusInfo(userId);

        // Verify
        assertThat(actual).isEqualTo(LoginStatus.NO_AUTHORITY);
        verify(authorityService, times(1)).getAuthoritiesByUserId(userId);
        verifyNoInteractions(userAuthService);
    }

    private AuthorityDTO createAuthority(Long accountId, AuthorityStatus status) {
        return AuthorityDTO.builder()
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .accountId(accountId)
                .status(status)
                .build();
    }
}