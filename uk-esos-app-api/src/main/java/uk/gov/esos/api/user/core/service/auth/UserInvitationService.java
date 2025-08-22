package uk.gov.esos.api.user.core.service.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import java.util.List;
import java.util.Optional;

import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import uk.gov.esos.api.authorization.core.domain.dto.UserRoleTypeDTO;
import uk.gov.esos.api.authorization.core.service.UserRoleTypeService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.user.core.domain.enumeration.KeycloakUserAttributes;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserInvitationService {

    private final AuthService authService;
    private final UserRoleTypeService userRoleTypeService;

    public String saveInvitedUser(UserRepresentation userRepresentation, RoleType desiredRoleType) {
        return authService.getByUsername(userRepresentation.getEmail())
            .map(existingUserRepresentation -> handleExistingUserInvitation(existingUserRepresentation, 
            		userRepresentation, desiredRoleType))
            .orElseGet(() -> authService.createUserWithStatusPending(userRepresentation));
    }

    private String handleExistingUserInvitation(UserRepresentation existingUserRepresentation,
                                                UserRepresentation newUserRepresentation, RoleType desiredRoleType) {
    	final String userId = existingUserRepresentation.getId();
		final Optional<RoleType> existingRoleTypeOpt = userRoleTypeService.getUserRoleTypeByUserIdOpt(userId).map(UserRoleTypeDTO::getRoleType);
		if (existingRoleTypeOpt.isPresent()) {
			final RoleType roleType = existingRoleTypeOpt.get();
			if (roleType == RoleType.REGULATOR || 
					roleType == RoleType.VERIFIER || 
					roleType != desiredRoleType) {
				log.error("User '{}' has already been introduced with role {}", () -> userId,
						() -> existingRoleTypeOpt.get().name());
				throw new BusinessException(ErrorCode.USER_ALREADY_REGISTERED);
			}
		}
		
		List<String> statuses = existingUserRepresentation.getAttributes()
				.get(KeycloakUserAttributes.USER_STATUS.getName());
        
        if(CollectionUtils.isEmpty(statuses)) {
        	throw new BusinessException(ErrorCode.INTERNAL_SERVER);
        }
        
        authService.saveUser(newUserRepresentation);
        return userId;
    }
}
