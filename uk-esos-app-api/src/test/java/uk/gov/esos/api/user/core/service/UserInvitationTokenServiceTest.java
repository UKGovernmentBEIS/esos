package uk.gov.esos.api.user.core.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.authorization.core.service.AuthorityService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.token.JwtTokenService;
import uk.gov.esos.api.user.core.domain.dto.InvitationTokenDTO;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;
import uk.gov.esos.api.token.JwtTokenActionEnum;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserInvitationTokenServiceTest {

    @InjectMocks
    private UserInvitationTokenService userInvitationTokenService;

    @Mock
    private JwtTokenService jwtTokenService;

    @Mock
    private AuthorityService authorityService;
    
    @Mock
    private UserAuthService userAuthService;
    
    @Test
    void resolveEmail() {
    	String invitationToken = "token";
    	JwtTokenActionEnum type = JwtTokenActionEnum.OPERATOR_INVITATION;
    	
    	String authorityUuid = "authorityUuid";
        AuthorityInfoDTO authorityInfo = AuthorityInfoDTO.builder()
            .id(1L)
            .userId("user")
            .authorityStatus(AuthorityStatus.PENDING)
            .accountId(1L)
            .build();
        
        UserInfoDTO userInfo = UserInfoDTO.builder()
        		.email("email")
        		.build();
        
        InvitationTokenDTO invitationTokenDTO = InvitationTokenDTO.builder()
        		.token(invitationToken)
        		.type(type)
        		.build();
    	when(jwtTokenService.resolveTokenActionClaim(invitationToken, type)).thenReturn(authorityUuid);
    	when(authorityService.findAuthorityByUuidAndStatusPending(authorityUuid)).thenReturn(Optional.of(authorityInfo));
    	when(userAuthService.getUserByUserIdOpt("user")).thenReturn(Optional.of(userInfo));
    	
    	String result = userInvitationTokenService.resolveEmail(invitationTokenDTO);
        
        assertThat(result).isEqualTo("email");
        
        verify(jwtTokenService, times(1)).resolveTokenActionClaim(invitationToken, type);
        verify(authorityService, times(1)).findAuthorityByUuidAndStatusPending(authorityUuid);
        verify(userAuthService, times(1)).getUserByUserIdOpt("user");
    }
    
    @Test
    void verifyInvitationToken() {
        String invitationToken = "invitationToken";
        JwtTokenActionEnum jwtTokenAction = JwtTokenActionEnum.OPERATOR_INVITATION;
        AppUser currentUser = AppUser.builder().userId("inviteduser").build();
        String authorityUuid = "authorityUuid";
        AuthorityInfoDTO authorityInfo = AuthorityInfoDTO.builder()
            .id(1L)
            .userId("inviteduser")
            .authorityStatus(AuthorityStatus.PENDING)
            .accountId(1L)
            .build();

        when(jwtTokenService.resolveTokenActionClaim(invitationToken, jwtTokenAction)).thenReturn(authorityUuid);
        when(authorityService.findAuthorityByUuidAndStatusPending(authorityUuid)).thenReturn(Optional.of(authorityInfo));

        AuthorityInfoDTO result = userInvitationTokenService.verifyInvitationToken(invitationToken, jwtTokenAction, currentUser);

        assertThat(result).isEqualTo(authorityInfo);

        verify(jwtTokenService, times(1)).resolveTokenActionClaim(invitationToken, jwtTokenAction);
        verify(authorityService, times(1)).findAuthorityByUuidAndStatusPending(authorityUuid);
    }
    
    @Test
    void verifyInvitationToken_invited_user_not_the_current_user() {
        String invitationToken = "invitationToken";
        JwtTokenActionEnum jwtTokenAction = JwtTokenActionEnum.OPERATOR_INVITATION;
        AppUser currentUser = AppUser.builder().userId("anotheruser").build();
        String authorityUuid = "authorityUuid";
        AuthorityInfoDTO authorityInfo = AuthorityInfoDTO.builder()
            .id(1L)
            .userId("inviteduser")
            .authorityStatus(AuthorityStatus.PENDING)
            .accountId(1L)
            .build();

        when(jwtTokenService.resolveTokenActionClaim(invitationToken, jwtTokenAction)).thenReturn(authorityUuid);
        when(authorityService.findAuthorityByUuidAndStatusPending(authorityUuid)).thenReturn(Optional.of(authorityInfo));

		BusinessException ex = assertThrows(BusinessException.class,
				() -> userInvitationTokenService.verifyInvitationToken(invitationToken, jwtTokenAction, currentUser));
		assertThat(ex.getErrorCode()).isEqualTo(ErrorCode.TOKEN_USER_NOT_INVITEE);

        verify(jwtTokenService, times(1)).resolveTokenActionClaim(invitationToken, jwtTokenAction);
        verify(authorityService, times(1)).findAuthorityByUuidAndStatusPending(authorityUuid);
    }

    @Test
    void verifyInvitationTokenForPendingAuthority() {
        String invitationToken = "invitationToken";
        JwtTokenActionEnum jwtTokenAction = JwtTokenActionEnum.OPERATOR_INVITATION;
        String authorityUuid = "authorityUuid";
        AuthorityInfoDTO authorityInfo = AuthorityInfoDTO.builder()
            .id(1L)
            .userId("user")
            .authorityStatus(AuthorityStatus.PENDING)
            .accountId(1L)
            .build();

        when(jwtTokenService.resolveTokenActionClaim(invitationToken, jwtTokenAction)).thenReturn(authorityUuid);
        when(authorityService.findAuthorityByUuidAndStatusPending(authorityUuid)).thenReturn(Optional.of(authorityInfo));

        AuthorityInfoDTO result = userInvitationTokenService.verifyInvitationTokenForPendingAuthority(invitationToken, jwtTokenAction);

        assertThat(result).isEqualTo(authorityInfo);

        verify(jwtTokenService, times(1)).resolveTokenActionClaim(invitationToken, jwtTokenAction);
        verify(authorityService, times(1)).findAuthorityByUuidAndStatusPending(authorityUuid);
    }

    @Test
    void verifyInvitationTokenForPendingAuthority_authority_not_found() {
        String invitationToken = "invitationToken";
        JwtTokenActionEnum jwtTokenAction = JwtTokenActionEnum.OPERATOR_INVITATION;
        String authorityUuid = "authorityUuid";


        when(jwtTokenService.resolveTokenActionClaim(invitationToken, jwtTokenAction)).thenReturn(authorityUuid);
        when(authorityService.findAuthorityByUuidAndStatusPending(authorityUuid)).thenReturn(Optional.empty());

        //invoke
        BusinessException ex = assertThrows(BusinessException.class, () ->
        userInvitationTokenService.verifyInvitationTokenForPendingAuthority(invitationToken, jwtTokenAction));

        assertThat(ex.getErrorCode()).isEqualTo(ErrorCode.INVALID_TOKEN);

        verify(jwtTokenService, times(1)).resolveTokenActionClaim(invitationToken, jwtTokenAction);
        verify(authorityService, times(1)).findAuthorityByUuidAndStatusPending(authorityUuid);
    }
}