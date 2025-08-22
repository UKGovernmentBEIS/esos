package uk.gov.esos.api.user.operator.service;

import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
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
import uk.gov.esos.api.user.operator.domain.OperatorInvitedUserInfoDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserAcceptInvitationDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserInviteAndRegisterDTO;
import uk.gov.esos.api.user.operator.transform.OperatorUserAcceptInvitationMapper;

@Service
@RequiredArgsConstructor
public class OperatorUserAcceptInvitationService {

	private final UserInvitationTokenService userInvitationTokenService;
    private final OperatorUserAuthService operatorUserAuthService;
    private final OperatorUserAcceptInvitationMapper operatorUserAcceptInvitationMapper;
    private final AccountQueryService accountQueryService;
    private final RoleService roleService;
    private final OperatorAuthorityService operatorAuthorityService;
    private final UserAuthService userAuthService;
    private final OperatorUserNotificationGateway operatorUserNotificationGateway;
    private final OperatorUserRegistrationService operatorUserRegistrationService;

	@Transactional
	public OperatorInvitedUserInfoDTO acceptInvitationAndRegister(AppUser appUser,
			OperatorUserInviteAndRegisterDTO operatorUserInviteAndRegisterDTO) {
		final AuthorityInfoDTO authorityInfo = userInvitationTokenService.verifyInvitationToken(
				operatorUserInviteAndRegisterDTO.getInvitationTokenDTO().getToken(),
				JwtTokenActionEnum.OPERATOR_INVITATION, appUser);

		validateUserRoleType(authorityInfo);
		
		// accept authority
		operatorAuthorityService.acceptAuthority(authorityInfo.getId());
		
		// register user (status to REGISTERED)
		operatorUserRegistrationService.registerUser(operatorUserInviteAndRegisterDTO.getOperatorUserRegistrationDTO(),
				appUser);
		
		final String accountName = accountQueryService.getAccountName(authorityInfo.getAccountId());
		
		// notify
		notify(authorityInfo, accountName);
		
		return OperatorInvitedUserInfoDTO.builder()
				.accountName(accountName)
				.build(); 
	}

	@Transactional
	public OperatorInvitedUserInfoDTO acceptInvitation(AppUser appUser, TokenDTO invitationTokenDTO) {
		final AuthorityInfoDTO authorityInfo = userInvitationTokenService
				.verifyInvitationToken(invitationTokenDTO.getToken(), JwtTokenActionEnum.OPERATOR_INVITATION, appUser);

		validateUserRoleType(authorityInfo);
		
		// accept authority
		operatorAuthorityService.acceptAuthority(authorityInfo.getId());
		
		final String accountName = accountQueryService.getAccountName(authorityInfo.getAccountId());
		
		// notify
		notify(authorityInfo, accountName);
		
		return OperatorInvitedUserInfoDTO.builder()
				.accountName(accountName)
				.build();
	}
	
	private void validateUserRoleType(final AuthorityInfoDTO authorityInfo) {
		final String roleCode = authorityInfo.getCode();
	
		final Set<String> operatorRoleCodes = roleService.getCodesByType(RoleType.OPERATOR);
		if (!operatorRoleCodes.contains(roleCode)) {
			throw new BusinessException(ErrorCode.AUTHORITY_USER_IS_NOT_OPERATOR);
		}
	}
	
	//TODO move notify in its own class (composition)
	private void notify(final AuthorityInfoDTO authorityInfo, String accountName) {
		final OperatorUserDTO userDTO = operatorUserAuthService.getOperatorUserById(authorityInfo.getUserId());
		final OperatorUserAcceptInvitationDTO operatorUserAcceptInvitation = operatorUserAcceptInvitationMapper
				.toOperatorUserAcceptInvitationDTO(userDTO, authorityInfo, accountName);

		final UserInfoDTO inviterUser = userAuthService.getUserByUserId(authorityInfo.getCreatedBy());

		// Notify invitee and inviter
		operatorUserNotificationGateway.notifyInviteeAcceptedInvitation(operatorUserAcceptInvitation);
		operatorUserNotificationGateway.notifyInviterAcceptedInvitation(operatorUserAcceptInvitation, inviterUser);
	}
}
