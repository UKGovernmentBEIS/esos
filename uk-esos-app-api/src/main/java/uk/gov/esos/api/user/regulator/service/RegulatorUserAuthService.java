package uk.gov.esos.api.user.regulator.service;

import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus;
import uk.gov.esos.api.user.core.domain.enumeration.KeycloakUserAttributes;
import uk.gov.esos.api.user.core.domain.model.UserDetails;
import uk.gov.esos.api.user.core.service.UserSignatureValidatorService;
import uk.gov.esos.api.user.core.service.auth.AuthService;
import uk.gov.esos.api.user.core.service.auth.UserInvitationService;
import uk.gov.esos.api.user.regulator.domain.RegulatorInvitedUserDetailsDTO;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserDTO;
import uk.gov.esos.api.user.regulator.transform.RegulatorInviteUserMapper;
import uk.gov.esos.api.user.regulator.transform.RegulatorUserMapper;

@Service
@RequiredArgsConstructor
public class RegulatorUserAuthService {

	private final AuthService authService;
    private final UserInvitationService userInvitationService;
    private final UserSignatureValidatorService userSignatureValidatorService;
    
    private final RegulatorUserMapper regulatorUserMapper;
    private final RegulatorInviteUserMapper regulatorInviteUserMapper;
    
    public RegulatorUserDTO getRegulatorUserById(String userId) {
        UserRepresentation userRep = authService.getUserRepresentationById(userId);
        return regulatorUserMapper.toRegulatorUserDTO(
                userRep, 
                authService.getUserDetails(userId).map(UserDetails::getSignature).orElse(null)
                );
    }
    
    public String saveInvitedUser(RegulatorInvitedUserDetailsDTO regulatorUserInvitation, FileDTO signature) {
    	// signature is not applicable, will not be saved TODO totally remove to avoid confusion
        userSignatureValidatorService.validateSignature(signature);
        
        UserRepresentation newUserRepresentation = regulatorInviteUserMapper.toUserRepresentation(regulatorUserInvitation);
        return userInvitationService.saveInvitedUser(newUserRepresentation, RoleType.REGULATOR);
    }
    
    public void updateRegulatorUser(String userId, RegulatorUserDTO newRegulatorUserDTO, FileDTO signature) {
        userSignatureValidatorService.validateSignature(signature);
        
        UserRepresentation registeredUser = authService.getUserRepresentationById(userId);
        
        UserRepresentation updatedUser = regulatorUserMapper.toUserRepresentation(newRegulatorUserDTO, userId,
                registeredUser.getUsername(), registeredUser.getEmail(), registeredUser.getAttributes());
        authService.saveUser(updatedUser);
    }
    
    public void registerUser(String userId) {
    	UserRepresentation userRepresentation = authService.getUserRepresentationById(userId);
		userRepresentation.singleAttribute(KeycloakUserAttributes.USER_STATUS.getName(),
				AuthenticationStatus.REGISTERED.name());
    	authService.saveUser(userRepresentation);
	}
    
}
