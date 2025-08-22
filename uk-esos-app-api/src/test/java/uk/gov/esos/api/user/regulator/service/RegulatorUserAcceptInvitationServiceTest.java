package uk.gov.esos.api.user.regulator.service;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.authorization.regulator.service.RegulatorAuthorityService;
import uk.gov.esos.api.token.JwtTokenActionEnum;
import uk.gov.esos.api.user.core.domain.dto.TokenDTO;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.service.UserInvitationTokenService;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

@ExtendWith(MockitoExtension.class)
class RegulatorUserAcceptInvitationServiceTest {

    @InjectMocks
    private RegulatorUserAcceptInvitationService cut;
    
    @Mock
    private UserInvitationTokenService userInvitationTokenService;
    
    @Mock
    private RegulatorUserAuthService regulatorUserAuthService;

    @Mock
    private UserAuthService userAuthService;

    @Mock
    private RegulatorAuthorityService regulatorAuthorityService;

    @Mock
    private RegulatorUserNotificationGateway regulatorUserNotificationGateway;

    
    @Test
    void acceptInvitationAndRegister() {
    	String token = "token";
    	String userId = "userId";
    	AppUser appUser = AppUser.builder().userId(userId).build();
    	TokenDTO invitationTokenDTO = TokenDTO.builder().token(token).build();
    	
    	Long authorityId = 1L;
    	AuthorityInfoDTO authorityInfo = AuthorityInfoDTO.builder()
    			.id(authorityId)
    			.userId(userId)
    			.createdBy("createdBy").build();
    	
    	AppUser currentUser = AppUser.builder().userId(userId).build();
    	
    	UserInfoDTO inviteeUser = UserInfoDTO.builder().firstName("fn1").email("email1").build();
    	UserInfoDTO inviterUser = UserInfoDTO.builder().firstName("fn2").build();
    	
		when(userInvitationTokenService.verifyInvitationToken(token,
				JwtTokenActionEnum.REGULATOR_INVITATION, currentUser)).thenReturn(authorityInfo);
        when(userAuthService.getUserByUserId(authorityInfo.getUserId())).thenReturn(inviteeUser);
        when(userAuthService.getUserByUserId(authorityInfo.getCreatedBy())).thenReturn(inviterUser);
        
        
        cut.acceptInvitationAndRegister(appUser, invitationTokenDTO);

        
        verify(userInvitationTokenService, times(1))
            .verifyInvitationToken(token, JwtTokenActionEnum.REGULATOR_INVITATION, currentUser);
        verify(regulatorAuthorityService, times(1)).acceptAuthority(authorityId);
		verify(regulatorUserAuthService, times(1))
				.registerUser(userId);
		verify(userAuthService, times(1)).getUserByUserId(authorityInfo.getUserId());
        verify(userAuthService, times(1)).getUserByUserId(authorityInfo.getCreatedBy());
        verify(regulatorUserNotificationGateway, times(1))
            .notifyInviteeAcceptedInvitation("email1");
        verify(regulatorUserNotificationGateway, times(1))
        	.notifyInviterAcceptedInvitation(inviteeUser, inviterUser);
    }
    
}