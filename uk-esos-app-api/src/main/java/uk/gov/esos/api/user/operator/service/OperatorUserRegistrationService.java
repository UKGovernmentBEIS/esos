package uk.gov.esos.api.user.operator.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.service.AccountQueryService;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserInvitationDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserRegistrationDTO;

@Service
@RequiredArgsConstructor
public class OperatorUserRegistrationService {

    private final OperatorUserAuthService operatorUserAuthService;
    private final OperatorAuthorityService operatorAuthorityService;
    private final AccountQueryService accountQueryService;
    private final OperatorUserNotificationGateway operatorUserNotificationGateway;

    /**
     * Create a new user with status {@link AuthenticationStatus#PENDING} and
     * adds him as {@link RoleType#OPERATOR}to the provided account.
     * @param operatorUserInvitationDTO the {@link OperatorUserInvitationDTO}
     * @param accountId the account id
     * @param currentUser the logged-in {@link AppUser}
     */
    @Transactional
    public void createUserToAccountWithStatusPending(OperatorUserInvitationDTO operatorUserInvitationDTO,
                                                       Long accountId, AppUser currentUser) {
        String roleCode = operatorUserInvitationDTO.getRoleCode();

		String userId =
				operatorUserAuthService.createOperatorUserAsPending(
						operatorUserInvitationDTO.getEmail(),
						operatorUserInvitationDTO.getFirstName(),
						operatorUserInvitationDTO.getLastName());
        String authorityUuid =
        		operatorAuthorityService.createPendingAuthorityForOperator(accountId, roleCode, userId, currentUser);

        String accountName = accountQueryService.getAccountName(accountId);

        operatorUserNotificationGateway.notifyInvitedUser(
        		operatorUserInvitationDTO,
        		accountName,
        		authorityUuid);
    }

	public OperatorUserDTO registerUser(OperatorUserRegistrationDTO operatorUserRegistrationDTO, AppUser currentUser) {
		OperatorUserDTO operatorUserDTO = operatorUserAuthService.registerUser(operatorUserRegistrationDTO,
				currentUser.getEmail());

		operatorUserNotificationGateway.notifyRegisteredUser(operatorUserDTO);

		return operatorUserDTO;
	}

	//TODO remove me
    public void sendVerificationEmail(String email) {
        operatorUserNotificationGateway.notifyEmailVerification(email);
    }
}
