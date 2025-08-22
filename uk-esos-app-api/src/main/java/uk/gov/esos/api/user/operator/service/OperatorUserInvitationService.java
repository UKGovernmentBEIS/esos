package uk.gov.esos.api.user.operator.service;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uk.gov.esos.api.account.service.validator.AccountStatus;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.user.operator.domain.OperatorUserInvitationDTO;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

@Service
@RequiredArgsConstructor
public class OperatorUserInvitationService {

    private final UserAuthService authUserService;
    private final OperatorUserRegistrationService operatorUserRegistrationService;
    private final ExistingOperatorUserInvitationService existingOperatorUserInvitationService;

    /**
     * Invites a new user to join an account with a specified role.
     * @param accountId the account id
     * @param userRegistrationDTO the {@link OperatorUserInvitationDTO}
     * @param currentUser the current logged-in {@link AppUser}
     */
    @Transactional
    @AccountStatus(expression = "{#status != 'AWAITING_APPROVAL' && #status != 'DENIED'}")
    public void inviteUserToAccount(Long accountId, OperatorUserInvitationDTO userRegistrationDTO, AppUser currentUser) {
        Optional<UserInfoDTO> userOptional = authUserService.getUserByEmail(userRegistrationDTO.getEmail());

        userOptional.ifPresentOrElse(
            userRepresentation -> existingOperatorUserInvitationService.addExistingUserToAccount(
            		userRegistrationDTO, accountId, userRepresentation.getUserId(), userRepresentation.getStatus(), 
            		currentUser),
            () -> operatorUserRegistrationService.createUserToAccountWithStatusPending(userRegistrationDTO, accountId, currentUser));
    }
}
