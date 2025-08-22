package uk.gov.esos.api.user.verifier.service;

import lombok.RequiredArgsConstructor;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.user.core.service.auth.AuthService;
import uk.gov.esos.api.user.core.service.auth.UserInvitationService;
import uk.gov.esos.api.user.verifier.domain.VerifierUserDTO;
import uk.gov.esos.api.user.verifier.domain.VerifierUserInvitationDTO;
import uk.gov.esos.api.user.verifier.transform.VerifierUserMapper;

@Service
@RequiredArgsConstructor
public class VerifierUserAuthService {

    private final AuthService authService;
    private final UserInvitationService userInvitationService;
    private final VerifierUserMapper verifierUserMapper;

    public VerifierUserDTO getVerifierUserById(String userId) {
        return verifierUserMapper.toVerifierUserDTO(authService.getUserRepresentationById(userId));
    }
    
    @Transactional
    public String saveInvitedUser(VerifierUserInvitationDTO verifierUserInvitation) {
        UserRepresentation newUserRepresentation = verifierUserMapper.toUserRepresentation(verifierUserInvitation);
        return userInvitationService.saveInvitedUser(newUserRepresentation, RoleType.VERIFIER);
    }

    public void updateVerifierUser(String userId, VerifierUserDTO verifierUserDTO) {
        UserRepresentation registeredUser = authService.getUserRepresentationById(userId);
        UserRepresentation updatedUser = verifierUserMapper.toUserRepresentation(verifierUserDTO, userId,
                registeredUser.getUsername(), registeredUser.getEmail(), registeredUser.getAttributes());

        authService.saveUser(updatedUser);
    }

}
