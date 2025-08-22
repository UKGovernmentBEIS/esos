package uk.gov.esos.api.user.regulator.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.authorization.regulator.service.RegulatorAuthorityService;
import uk.gov.esos.api.token.JwtTokenActionEnum;
import uk.gov.esos.api.user.core.domain.dto.TokenDTO;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.service.UserInvitationTokenService;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

@Service
@RequiredArgsConstructor
public class RegulatorUserAcceptInvitationService {

	private final UserInvitationTokenService userInvitationTokenService;
	private final RegulatorUserAuthService regulatorUserAuthService;
    private final UserAuthService userAuthService;
    private final RegulatorAuthorityService regulatorAuthorityService;
    private final RegulatorUserNotificationGateway regulatorUserNotificationGateway;
    
    @Transactional
	public void acceptInvitationAndRegister(AppUser appUser,
			TokenDTO invitationTokenDTO) {
		final AuthorityInfoDTO authorityInfo = userInvitationTokenService
				.verifyInvitationToken(
						invitationTokenDTO.getToken(), JwtTokenActionEnum.REGULATOR_INVITATION, appUser);

		// accept authority
		regulatorAuthorityService.acceptAuthority(authorityInfo.getId());
		
		// register user (status to REGISTERED)
		regulatorUserAuthService.registerUser(appUser.getUserId());
		
		// notify
		notify(authorityInfo);
	}

	//TODO move notify in its own class (composition)
	private void notify(final AuthorityInfoDTO authorityInfo) {
		final UserInfoDTO invitee = userAuthService.getUserByUserId(authorityInfo.getUserId());
        final UserInfoDTO inviter = userAuthService.getUserByUserId(authorityInfo.getCreatedBy());
        final String inviteeEmail = invitee.getEmail();

        regulatorUserNotificationGateway.notifyInviteeAcceptedInvitation(inviteeEmail);
        regulatorUserNotificationGateway.notifyInviterAcceptedInvitation(invitee, inviter);
	}
    
}
