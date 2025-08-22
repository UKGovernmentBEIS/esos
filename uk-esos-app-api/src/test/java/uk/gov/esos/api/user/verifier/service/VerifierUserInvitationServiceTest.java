package uk.gov.esos.api.user.verifier.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.common.exception.ErrorCode.USER_INVALID_STATUS;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.authorization.verifier.service.VerifierAuthorityService;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.user.verifier.domain.AdminVerifierUserInvitationDTO;
import uk.gov.esos.api.user.core.domain.dto.InvitedUserInfoDTO;
import uk.gov.esos.api.user.verifier.domain.VerifierUserDTO;
import uk.gov.esos.api.user.verifier.domain.VerifierUserInvitationDTO;
import uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus;
import uk.gov.esos.api.verificationbody.service.VerificationBodyQueryService;

@ExtendWith(MockitoExtension.class)
class VerifierUserInvitationServiceTest {

    @InjectMocks
    private VerifierUserInvitationService verifierUserInvitationService;

    @Mock
    private VerifierUserAuthService verifierUserAuthService;

    @Mock
    private VerifierAuthorityService verifierAuthorityService;

    @Mock
    private VerifierUserNotificationGateway verifierUserNotificationGateway;

    @Mock
    private VerifierUserTokenVerificationService verifierUserTokenVerificationService;

    @Mock
    private VerificationBodyQueryService verificationBodyQueryService;

    @Test
    void inviteVerifierUser() {
        final Long vbId = 1L;
        final String invitedUserId = "invitedUserId";
        AppUser pmrvUser = AppUser.builder().userId("user").build();
        pmrvUser.setAuthorities(List.of(AppAuthority.builder().code("verifier_admin").verificationBodyId(vbId).build()));

        VerifierUserInvitationDTO verifierUserInvitation = createVerifierUserInvitationDTO();

        String authorityUuid = "uuid";

        when(verifierUserAuthService.saveInvitedUser(verifierUserInvitation)).thenReturn(invitedUserId);
        when(verifierAuthorityService.createPendingAuthority(vbId, verifierUserInvitation.getRoleCode(), invitedUserId, pmrvUser))
            .thenReturn(authorityUuid);

        //invoke
        verifierUserInvitationService.inviteVerifierUser(pmrvUser, verifierUserInvitation);

        //verify
        verify(verifierUserAuthService, times(1)).saveInvitedUser(verifierUserInvitation);
        verify(verifierAuthorityService, times(1))
            .createPendingAuthority(vbId, verifierUserInvitation.getRoleCode(), invitedUserId, pmrvUser);
        verify(verifierUserNotificationGateway, times(1))
            .notifyInvitedUser(verifierUserInvitation, authorityUuid);
    }

    @Test
    void inviteVerifierAdminUser() {
        Long verificationBodyId = 1L;
        String invitedUserId = "invitedUserId";
        AppUser pmrvUser = AppUser.builder().userId("user").build();
        AdminVerifierUserInvitationDTO adminVerifierUserInvitation = AdminVerifierUserInvitationDTO.builder()
            .email("email")
            .firstName("firstName")
            .lastName("lastName")
            .phoneNumber("69999999999")
            .build();

        VerifierUserInvitationDTO verifierUserInvitation = createVerifierUserInvitationDTO();
        String authorityUuid = "uuid";
        
        when(verificationBodyQueryService.existsNonDisabledVerificationBodyById(verificationBodyId)).thenReturn(true);
        when(verifierUserAuthService.saveInvitedUser(verifierUserInvitation)).thenReturn(invitedUserId);
        when(verifierAuthorityService
            .createPendingAuthority(verificationBodyId, verifierUserInvitation.getRoleCode(), invitedUserId, pmrvUser))
            .thenReturn(authorityUuid);

        verifierUserInvitationService.inviteVerifierAdminUser(pmrvUser, adminVerifierUserInvitation, verificationBodyId);

        // verify
        verify(verificationBodyQueryService, times(1)).existsNonDisabledVerificationBodyById(verificationBodyId);
        verify(verifierUserAuthService, times(1)).saveInvitedUser(verifierUserInvitation);
        verify(verifierAuthorityService, times(1))
            .createPendingAuthority(verificationBodyId, verifierUserInvitation.getRoleCode(), invitedUserId, pmrvUser);
        verify(verifierUserNotificationGateway, times(1))
            .notifyInvitedUser(verifierUserInvitation, authorityUuid);
    }

    @Test
    void inviteVerifierAdminUser_vb_not_exists() {
        Long verificationBodyId = 1L;
        AppUser pmrvUser = AppUser.builder().userId("user").build();
        AdminVerifierUserInvitationDTO adminVerifierUserInvitation = AdminVerifierUserInvitationDTO.builder()
                .email("email")
                .firstName("firstName")
                .lastName("lastName")
                .phoneNumber("69999999999")
                .build();

        when(verificationBodyQueryService.existsNonDisabledVerificationBodyById(verificationBodyId)).thenReturn(false);

        BusinessException businessException = assertThrows(BusinessException.class, () ->
                verifierUserInvitationService.inviteVerifierAdminUser(pmrvUser, adminVerifierUserInvitation, verificationBodyId));

        // Verify
        assertEquals(ErrorCode.RESOURCE_NOT_FOUND, businessException.getErrorCode());
        verify(verificationBodyQueryService, times(1)).existsNonDisabledVerificationBodyById(verificationBodyId);
        verify(verifierUserAuthService, never()).saveInvitedUser(any());
        verify(verifierAuthorityService, never()).createPendingAuthority(anyLong(), anyString(), anyString(), any());
        verify(verifierUserNotificationGateway, never()).notifyInvitedUser(any(), any());
    }

    @Test
    void acceptInvitation() {
        String invitationToken = "invitationToken";
        String userEmail = "userEmail";
        AuthorityInfoDTO authorityInfo = AuthorityInfoDTO.builder()
            .id(1L)
            .authorityStatus(AuthorityStatus.PENDING)
            .userId("userId")
            .build();

        VerifierUserDTO verifierUser = VerifierUserDTO.builder()
            .email(userEmail)
            .status(AuthenticationStatus.PENDING)
            .build();

        InvitedUserInfoDTO expectedInvitedUserInfo = InvitedUserInfoDTO.builder().email(userEmail).build();

        when(verifierUserTokenVerificationService.verifyInvitationTokenForPendingAuthority(invitationToken)).thenReturn(authorityInfo);
        when(verifierUserAuthService.getVerifierUserById(authorityInfo.getUserId())).thenReturn(verifierUser);

        InvitedUserInfoDTO actualInvitedUserInfo = verifierUserInvitationService.acceptInvitation(invitationToken);

        assertEquals(expectedInvitedUserInfo, actualInvitedUserInfo);

        verify(verifierUserTokenVerificationService, times(1)).verifyInvitationTokenForPendingAuthority(invitationToken);
        verify(verifierUserAuthService, times(1)).getVerifierUserById(authorityInfo.getUserId());
    }

    @Test
    void acceptInvitation_when_user_authentication_status_not_pending() {
        String invitationToken = "invitationToken";
        AuthorityInfoDTO authorityInfo = AuthorityInfoDTO.builder()
            .id(1L)
            .authorityStatus(AuthorityStatus.PENDING)
            .userId("userId")
            .build();

        VerifierUserDTO verifierUser = VerifierUserDTO.builder().status(AuthenticationStatus.REGISTERED).build();

        when(verifierUserTokenVerificationService.verifyInvitationTokenForPendingAuthority(invitationToken)).thenReturn(authorityInfo);
        when(verifierUserAuthService.getVerifierUserById(authorityInfo.getUserId())).thenReturn(verifierUser);

        BusinessException businessException = assertThrows(BusinessException.class, () ->
            verifierUserInvitationService.acceptInvitation(invitationToken));

        assertThat(businessException.getErrorCode()).isEqualTo(USER_INVALID_STATUS);

        verify(verifierUserTokenVerificationService, times(1)).verifyInvitationTokenForPendingAuthority(invitationToken);
        verify(verifierUserAuthService, times(1)).getVerifierUserById(authorityInfo.getUserId());
    }

    private VerifierUserInvitationDTO createVerifierUserInvitationDTO() {
        return VerifierUserInvitationDTO.builder()
            .roleCode("verifier_admin")
            .firstName("firstName")
            .lastName("lastName")
            .email("email")
            .phoneNumber("69999999999")
            .build();
    }
}