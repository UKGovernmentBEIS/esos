package uk.gov.esos.api.user.core.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.authorization.core.service.AuthorityService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.token.JwtTokenService;
import uk.gov.esos.api.user.core.domain.dto.InvitationTokenDTO;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;
import uk.gov.esos.api.token.JwtTokenActionEnum;

@Service
@RequiredArgsConstructor
public class UserInvitationTokenService {

    private final JwtTokenService jwtTokenService;
    private final AuthorityService authorityService;
    private final UserAuthService userAuthService;
    
	public String resolveEmail(InvitationTokenDTO invitationToken) {
		AuthorityInfoDTO authorityInfo = this.verifyInvitationTokenForPendingAuthority(invitationToken.getToken(),
				invitationToken.getType());
		UserInfoDTO userInfo = userAuthService.getUserByUserIdOpt(authorityInfo.getUserId())
				.orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN, invitationToken));
		return userInfo.getEmail();
	}
	
	public AuthorityInfoDTO verifyInvitationToken(String invitationToken, JwtTokenActionEnum tokenAction, AppUser currentUser) {
		final AuthorityInfoDTO authorityInfo = verifyInvitationTokenForPendingAuthority(invitationToken, tokenAction);
		
		verifyInviteeIsTheCurrentUser(authorityInfo, currentUser);
		
		return authorityInfo;
    }

    public AuthorityInfoDTO verifyInvitationTokenForPendingAuthority(String invitationToken, JwtTokenActionEnum tokenAction) {
        String authorityUuid = jwtTokenService.resolveTokenActionClaim(invitationToken, tokenAction);
        return authorityService.findAuthorityByUuidAndStatusPending(authorityUuid)
            .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN));
    }
    
    private void verifyInviteeIsTheCurrentUser(final AuthorityInfoDTO authorityInfo, AppUser currentUser) {
		if(!currentUser.getUserId().equals(authorityInfo.getUserId())) {
			throw new BusinessException(ErrorCode.TOKEN_USER_NOT_INVITEE);
		}
	}

}
