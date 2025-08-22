package uk.gov.esos.api.user.operator.service;

import lombok.RequiredArgsConstructor;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus;
import uk.gov.esos.api.user.core.domain.enumeration.KeycloakUserAttributes;
import uk.gov.esos.api.user.core.service.auth.AuthService;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserInvitationDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserRegistrationDTO;
import uk.gov.esos.api.user.operator.transform.OperatorUserMapper;
import uk.gov.esos.api.user.operator.transform.OperatorUserRegistrationMapper;

@Service
@RequiredArgsConstructor
public class OperatorUserAuthService {

	private final AuthService authService;
    private final OperatorUserMapper operatorUserMapper;
    private final OperatorUserRegistrationMapper operatorUserRegistrationMapper;

    public OperatorUserDTO getOperatorUserById(String userId) {
        return operatorUserMapper.toOperatorUserDTO(authService.getUserRepresentationById(userId));
    }
    
    public OperatorUserDTO registerUser(OperatorUserRegistrationDTO operatorUserRegistrationDTO, String email) {
    	UserRepresentation userRepresentation =
                operatorUserRegistrationMapper.toUserRepresentation(operatorUserRegistrationDTO, email);
    	
		userRepresentation.singleAttribute(KeycloakUserAttributes.USER_STATUS.getName(),
				AuthenticationStatus.REGISTERED.name());
    	authService.saveUser(userRepresentation);
    	
    	return operatorUserMapper.toOperatorUserDTO(userRepresentation);
	}
    
    public String updateUser(OperatorUserInvitationDTO operatorUserInvitation) {
        UserRepresentation userRepresentation = operatorUserMapper.toUserRepresentation(operatorUserInvitation);
        return authService.saveUser(userRepresentation);
    }

    /**
     * Create a new user in keycloak with status {@link AuthenticationStatus#PENDING}
     * and {@link UserRepresentation#setEnabled} false.
     * @param email the user email
     * @param firstName the user first name
     * @param lastName the user last name
     * @return the  user id (from keycloak)
     */
    public String createOperatorUserAsPending(String email, String firstName, String lastName) {
        UserRepresentation userRepresentation = operatorUserMapper.toUserRepresentation(email, firstName, lastName);
        return authService.createUserWithStatusPending(userRepresentation);
    }

    /**
     * Updates an existing keycloak user with attributes of {@code updatedOperatorUserDTO}.
     * @param userId the user id
     * @param updatedOperatorUserDTO {@link OperatorUserDTO}
     */
    public void updateOperatorUser(String userId, OperatorUserDTO updatedOperatorUserDTO) {
        UserRepresentation registeredUser = authService.getUserRepresentationById(userId);
        UserRepresentation updatedUser = operatorUserMapper.toUserRepresentation(updatedOperatorUserDTO, userId,
                registeredUser.getUsername(), registeredUser.getEmail(), registeredUser.getAttributes());

        authService.saveUser(updatedUser);
    }

}
