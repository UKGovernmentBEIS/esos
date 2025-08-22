//package uk.gov.esos.api.user.operator.service;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertThrows;
//import static org.mockito.Mockito.times;
//import static org.mockito.Mockito.verify;
//import static org.mockito.Mockito.verifyNoInteractions;
//import static org.mockito.Mockito.when;
//
//import java.util.Set;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import uk.gov.esos.api.authorization.core.domain.Authority;
//import uk.gov.esos.api.authorization.core.service.RoleService;
//import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityService;
//import uk.gov.esos.api.common.domain.enumeration.RoleType;
//import uk.gov.esos.api.common.exception.BusinessException;
//import uk.gov.esos.api.common.exception.ErrorCode;
//import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
//import uk.gov.esos.api.user.core.service.auth.UserAuthService;
//import uk.gov.esos.api.user.operator.domain.OperatorUserAcceptInvitationDTO;
//import uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus;
//import uk.gov.esos.api.user.core.domain.enumeration.UserInvitationStatus;
//
//@ExtendWith(MockitoExtension.class)
//class OperatorRoleCodeAcceptInvitationServiceTest {
//
//    @InjectMocks
//    private OperatorRoleCodeAcceptInvitationService cut;
//
//    @Mock
//    private OperatorAuthorityService operatorAuthorityService;
//
//    @Mock
//    private OperatorUserNotificationGateway operatorUserNotificationGateway;
//
//    @Mock
//    private RoleService roleService;
//
//    @Mock
//    private OperatorUserAuthService operatorUserAuthService;
//
//    @Mock
//    private UserAuthService userAuthService;
//
//    @Test
//    void acceptInvitation_user_authentication_status_pending() {
//    	String roleCode = "rolecode";
//    	when(roleService.getCodesByType(RoleType.OPERATOR)).thenReturn(Set.of(roleCode));
//    	
//        OperatorUserAcceptInvitationDTO operatorUserAcceptInvitation = OperatorUserAcceptInvitationDTO.builder()
//            .userAuthenticationStatus(AuthenticationStatus.PENDING)
//            .build();
//
//        UserInvitationStatus userInvitationStatus = cut.acceptInvitation(operatorUserAcceptInvitation, roleCode);
//
//        assertEquals(UserInvitationStatus.PENDING_USER_REGISTRATION, userInvitationStatus);
//
//        verifyNoInteractions(operatorAuthorityService, operatorUserNotificationGateway, operatorUserAuthService, userAuthService);
//        verify(roleService, times(1)).getCodesByType(RoleType.OPERATOR);
//    }
//
//    @Test
//    void acceptInvitation_user_authentication_status_registered_and_has_password() {
//    	String roleCode = "rolecode";
//    	when(roleService.getCodesByType(RoleType.OPERATOR)).thenReturn(Set.of(roleCode));
//    	
//        Long authorityId = 1L;
//        String inviterUserId = "inviterUserId";
//        OperatorUserAcceptInvitationDTO operatorUserAcceptInvitation = OperatorUserAcceptInvitationDTO.builder()
//            .userAuthenticationStatus(AuthenticationStatus.REGISTERED)
//            .userId("userId")
//            .accountId(2L)
//            .userAuthorityId(authorityId)
//            .build();
//        Authority authority = Authority.builder().createdBy(inviterUserId).build();
//        UserInfoDTO inviterUser = UserInfoDTO.builder().build();
//
//        when(operatorUserAuthService.hasOperatorUserPassword(operatorUserAcceptInvitation.getUserId())).thenReturn(true);
//        when(operatorAuthorityService.acceptAuthority(authorityId)).thenReturn(authority);
//        when(userAuthService.getUserByUserId(inviterUserId)).thenReturn(inviterUser);
//
//        UserInvitationStatus userInvitationStatus = cut.acceptInvitation(operatorUserAcceptInvitation, roleCode);
//
//        assertEquals(UserInvitationStatus.ACCEPTED, userInvitationStatus);
//
//        verify(operatorUserAuthService, times(1))
//                .hasOperatorUserPassword(operatorUserAcceptInvitation.getUserId());
//        verify(operatorAuthorityService, times(1))
//                .acceptAuthority(authorityId);
//        verify(userAuthService, times(1))
//                .getUserByUserId(inviterUserId);
//        verify(operatorUserNotificationGateway, times(1))
//                .notifyInviteeAcceptedInvitation(operatorUserAcceptInvitation);
//        verify(operatorUserNotificationGateway, times(1))
//                .notifyInviterAcceptedInvitation(operatorUserAcceptInvitation, inviterUser);
//        verify(roleService, times(1)).getCodesByType(RoleType.OPERATOR);
//    }
//
//    @Test
//    void acceptInvitation_user_authentication_status_registered_and_no_password() {
//    	String roleCode = "rolecode";
//    	when(roleService.getCodesByType(RoleType.OPERATOR)).thenReturn(Set.of(roleCode));
//    	
//        Long authorityId = 1L;
//        String userId = "userId";
//        OperatorUserAcceptInvitationDTO operatorUserAcceptInvitation = OperatorUserAcceptInvitationDTO.builder()
//            .userAuthenticationStatus(AuthenticationStatus.REGISTERED)
//            .userId(userId)
//            .userAuthorityId(authorityId)
//            .build();
//
//        when(operatorUserAuthService.hasOperatorUserPassword(operatorUserAcceptInvitation.getUserId())).thenReturn(false);
//
//        UserInvitationStatus userInvitationStatus = cut.acceptInvitation(operatorUserAcceptInvitation, roleCode);
//
//        assertEquals(UserInvitationStatus.PENDING_USER_ENABLE, userInvitationStatus);
//
//        verifyNoInteractions(operatorAuthorityService, operatorUserNotificationGateway, userAuthService);
//        verify(roleService, times(1)).getCodesByType(RoleType.OPERATOR);
//    }
//    
//    @Test
//    void acceptInvitation_throw_error_if_role_no_operator() {
//    	String roleCode = "rolecode";
//    	when(roleService.getCodesByType(RoleType.OPERATOR)).thenReturn(Set.of("another role"));
//    	
//    	OperatorUserAcceptInvitationDTO operatorUserAcceptInvitation = OperatorUserAcceptInvitationDTO.builder()
//                .userAuthenticationStatus(AuthenticationStatus.REGISTERED)
//                .userId("user")
//                .userAuthorityId(1L)
//                .build();
//    	
//    	BusinessException be = assertThrows(BusinessException.class,
//                () -> cut.acceptInvitation(operatorUserAcceptInvitation, roleCode));
//        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.AUTHORITY_USER_IS_NOT_OPERATOR);
//
//        verify(roleService, times(1)).getCodesByType(RoleType.OPERATOR);
//        verifyNoInteractions(operatorUserAuthService, operatorAuthorityService, operatorUserNotificationGateway, userAuthService);
//    }
//
//}