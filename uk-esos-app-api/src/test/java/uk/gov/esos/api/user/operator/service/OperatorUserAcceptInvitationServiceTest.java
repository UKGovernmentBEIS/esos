package uk.gov.esos.api.user.operator.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.service.AccountQueryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.authorization.core.service.RoleService;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.token.JwtTokenActionEnum;
import uk.gov.esos.api.user.core.domain.dto.TokenDTO;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.service.UserInvitationTokenService;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;
import uk.gov.esos.api.user.operator.domain.OperatorUserAcceptInvitationDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserInviteAndRegisterDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserRegistrationDTO;
import uk.gov.esos.api.user.operator.transform.OperatorUserAcceptInvitationMapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.Set;

@ExtendWith(MockitoExtension.class)
class OperatorUserAcceptInvitationServiceTest {

    @InjectMocks
    private OperatorUserAcceptInvitationService operatorUserAcceptInvitationService;
    
    @Mock
    private UserInvitationTokenService userInvitationTokenService;

    @Mock
    private OperatorUserAuthService operatorUserAuthService;
    
    @Mock
    private OperatorUserAcceptInvitationMapper operatorUserAcceptInvitationMapper;

    @Mock
    private AccountQueryService accountQueryService;
    
    @Mock
    private RoleService roleService;
    
    @Mock
    private OperatorAuthorityService operatorAuthorityService;
    
    @Mock 
    private UserAuthService userAuthService;
    
    @Mock
    private OperatorUserRegistrationService operatorUserRegistrationService;
    
    @Mock
    private OperatorUserNotificationGateway operatorUserNotificationGateway;

    @Test
    void acceptInvitationAndRegister() {
    	String token = "token";
    	AppUser appUser = AppUser.builder().userId("userId").build();
    	OperatorUserInviteAndRegisterDTO operatorUserInviteAndRegisterDTO = OperatorUserInviteAndRegisterDTO.builder()
    			.invitationTokenDTO(TokenDTO.builder().token(token).build())
    			.operatorUserRegistrationDTO(OperatorUserRegistrationDTO.builder()
    					.firstName("fn")
    					.build())
    			.build();
    	
    	Long authorityId = 1L;
    	String userId = "userId";
        Long accountId = 1L;
        String authorityRoleCode = "roleCode";
        String accountInstallationName = "accountInstallationName";
    	AuthorityInfoDTO authorityInfo = AuthorityInfoDTO.builder()
    			.id(authorityId)
    			.userId(userId)
    			.accountId(accountId)
    			.createdBy("createdBy")
    			.code(authorityRoleCode).build();
    	
    	AppUser currentUser = AppUser.builder().userId(userId).build();
    	
    	OperatorUserDTO userDTO = OperatorUserDTO.builder().email("email@email").build();
    	
    	OperatorUserAcceptInvitationDTO operatorUserAcceptInvitation = OperatorUserAcceptInvitationDTO.builder().build();
    	
    	UserInfoDTO inviterUser = UserInfoDTO.builder().firstName("fn2").build();
    	
    	when(userInvitationTokenService.verifyInvitationToken(token, JwtTokenActionEnum.OPERATOR_INVITATION, currentUser)).thenReturn(authorityInfo);
        when(roleService.getCodesByType(RoleType.OPERATOR)).thenReturn(Set.of("roleCode"));
        when(operatorUserAuthService.getOperatorUserById(authorityInfo.getUserId())).thenReturn(userDTO);
        when(accountQueryService.getAccountName(authorityInfo.getAccountId())).thenReturn(accountInstallationName);
        when(operatorUserAcceptInvitationMapper.toOperatorUserAcceptInvitationDTO(userDTO, authorityInfo, accountInstallationName))
        	.thenReturn(operatorUserAcceptInvitation);
        when(userAuthService.getUserByUserId(authorityInfo.getCreatedBy())).thenReturn(inviterUser);
        
        
        operatorUserAcceptInvitationService.acceptInvitationAndRegister(appUser, operatorUserInviteAndRegisterDTO);

        
        verify(userInvitationTokenService, times(1))
            .verifyInvitationToken(token, JwtTokenActionEnum.OPERATOR_INVITATION, currentUser);
        verify(roleService, times(1))
        	.getCodesByType(RoleType.OPERATOR);
        verify(operatorAuthorityService, times(1)).acceptAuthority(authorityId);
		verify(operatorUserRegistrationService, times(1))
				.registerUser(operatorUserInviteAndRegisterDTO.getOperatorUserRegistrationDTO(), appUser);
		verify(operatorUserAuthService, times(1)).getOperatorUserById(authorityInfo.getUserId());
        verify(accountQueryService, times(1)).getAccountName(accountId);
        verify(operatorUserAcceptInvitationMapper, times(1)).
            toOperatorUserAcceptInvitationDTO(userDTO, authorityInfo, accountInstallationName);
        verify(userAuthService, times(1)).getUserByUserId(authorityInfo.getCreatedBy());
        verify(operatorUserNotificationGateway, times(1))
            .notifyInviteeAcceptedInvitation(operatorUserAcceptInvitation);
        verify(operatorUserNotificationGateway, times(1))
        	.notifyInviterAcceptedInvitation(operatorUserAcceptInvitation, inviterUser);
    }

	@Test
	void acceptInvitationAndRegister_no_operator() {
		String token = "token";
    	AppUser appUser = AppUser.builder().userId("userId").build();
    	OperatorUserInviteAndRegisterDTO operatorUserInviteAndRegisterDTO = OperatorUserInviteAndRegisterDTO.builder()
    			.invitationTokenDTO(TokenDTO.builder().token(token).build())
    			.operatorUserRegistrationDTO(OperatorUserRegistrationDTO.builder()
    					.firstName("fn")
    					.build())
    			.build();
    	
    	Long authorityId = 1L;
    	String userId = "userId";
        Long accountId = 1L;
        String authorityRoleCode = "roleCode";
    	AuthorityInfoDTO authorityInfo = AuthorityInfoDTO.builder()
    			.id(authorityId)
    			.userId(userId)
    			.accountId(accountId)
    			.createdBy("createdBy")
    			.code(authorityRoleCode).build();
    	
    	AppUser currentUser = AppUser.builder().userId(userId).build();
    	when(userInvitationTokenService.verifyInvitationToken(token, JwtTokenActionEnum.OPERATOR_INVITATION, currentUser)).thenReturn(authorityInfo);
        when(roleService.getCodesByType(RoleType.OPERATOR)).thenReturn(Set.of("otherRoleCode"));
        
        

		BusinessException businessException = assertThrows(BusinessException.class,
				() -> operatorUserAcceptInvitationService.acceptInvitationAndRegister(appUser, operatorUserInviteAndRegisterDTO));

		assertEquals(ErrorCode.AUTHORITY_USER_IS_NOT_OPERATOR, businessException.getErrorCode());

		 verify(userInvitationTokenService, times(1))
         	.verifyInvitationToken(token, JwtTokenActionEnum.OPERATOR_INVITATION, currentUser);
		 verify(roleService, times(1))
     		.getCodesByType(RoleType.OPERATOR);
			verifyNoInteractions(operatorUserAuthService, operatorUserRegistrationService, accountQueryService,
					operatorUserAcceptInvitationMapper, userAuthService, operatorUserNotificationGateway);
	}
}