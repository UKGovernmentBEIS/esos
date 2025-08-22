package uk.gov.esos.api.user.operator.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityRoleDTO;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.user.core.service.UserSecuritySetupService;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OperatorUserManagementService {

    private final OperatorUserAuthService operatorUserAuthService;
    private final OperatorAuthorityService operatorAuthorityService;
    private final UserSecuritySetupService userSecuritySetupService;

    /**
     * Returns the Operator User.
     * @param accountId Account id
     * @param userId Keycloak user id
     * @return {@link OperatorUserDTO}
     */
    public OperatorUserDTO getOperatorUserByAccountAndId(Long accountId, String userId) {
        // Validate editing user
        validateOperatorUserAuthorityToAccount(userId, accountId);

        return operatorUserAuthService.getOperatorUserById(userId);
    }
    
    /**
     * Updates operator user details.
     *
     * @param user {@link AppUser}
     * @param operatorUserDTO {@link OperatorUserDTO}
     */
    public void updateOperatorUser(AppUser user, OperatorUserDTO operatorUserDTO) {
        operatorUserAuthService.updateOperatorUser(user.getUserId(), operatorUserDTO);
    }

    /**
     * Updates the Operator User.
     * @param accountId Account id
     * @param userId Keycloak user id
     * @param operatorUserDTO {@link OperatorUserDTO}
     */
    public void updateOperatorUserByAccountAndId(Long accountId, String userId, OperatorUserDTO operatorUserDTO) {
        // Validate editing user
        validateOperatorUserAuthorityToAccount(userId, accountId);

        // Update user
        operatorUserAuthService.updateOperatorUser(userId, operatorUserDTO);
    }
    
	public void resetOperator2Fa(Long accountId, String userId) {
		validateOperatorUserAuthorityToAccount(userId, accountId);
		userSecuritySetupService.resetUser2Fa(userId);
	}

    private void validateOperatorUserAuthorityToAccount(String userId, Long accountId) {
        List<String> operatorUserIds = operatorAuthorityService.findOperatorUserAuthorityRoleListByAccount(accountId)
                .stream().map(AuthorityRoleDTO::getUserId).collect(Collectors.toList());

        // Check if user id exists on account's users
        if (!operatorUserIds.contains(userId)) {
            throw new BusinessException(ErrorCode.AUTHORITY_USER_NOT_RELATED_TO_ACCOUNT);
        }
    }
}
