package uk.gov.esos.api.user.verifier.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.user.core.service.auth.AuthService;
import uk.gov.esos.api.user.core.service.auth.UserInvitationService;
import uk.gov.esos.api.user.verifier.domain.VerifierUserDTO;
import uk.gov.esos.api.user.verifier.domain.VerifierUserInvitationDTO;
import uk.gov.esos.api.user.verifier.transform.VerifierUserMapper;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus.REGISTERED;

@ExtendWith(MockitoExtension.class)
class VerifierUserAuthServiceTest {

    @InjectMocks
    private VerifierUserAuthService service;

    @Mock
    private AuthService authService;

    @Mock
    private UserInvitationService userRegistrationService;

    @Mock
    private VerifierUserMapper verifierUserMapper;

    @Test
    void getVerifierUserById() {
        String userId = "userId";
        UserRepresentation userRepresentation = createUserRepresentation(userId, "email");
        VerifierUserDTO expected = createVerifierUserDTO("email");

        // Mock
        when(authService.getUserRepresentationById(userId)).thenReturn(userRepresentation);
        when(verifierUserMapper.toVerifierUserDTO(userRepresentation)).thenReturn(expected);

        // Invoke
        VerifierUserDTO actual = service.getVerifierUserById(userId);

        // Assert
        assertEquals(expected, actual);
        verify(authService, times(1)).getUserRepresentationById(userId);
        verify(verifierUserMapper, times(1)).toVerifierUserDTO(userRepresentation);
    }

    @Test
    void updateVerifierUser() {
        String userId = "userId";
        UserRepresentation userRepresentation = createUserRepresentation(userId, "email");
        UserRepresentation userRepresentationUpdated = createUserRepresentation(userId, "email2");
        VerifierUserDTO verifierUserDTO = createVerifierUserDTO("email");

        // Mock
        when(authService.getUserRepresentationById(userId)).thenReturn(userRepresentation);
        when(verifierUserMapper.toUserRepresentation(verifierUserDTO, userId, userRepresentation.getUsername(),
                verifierUserDTO.getEmail(), userRepresentation.getAttributes())).thenReturn(userRepresentationUpdated);

        // Invoke
        service.updateVerifierUser(userId, verifierUserDTO);

        // Assert
        verify(authService, times(1)).getUserRepresentationById(userId);
        verify(verifierUserMapper, times(1)).toUserRepresentation(verifierUserDTO, userId,
                userRepresentation.getUsername(), verifierUserDTO.getEmail(), userRepresentation.getAttributes());
        verify(authService, times(1)).saveUser(userRepresentationUpdated);
    }

    @Test
    void saveInvitedUser() {
        final String userId = "user";
        VerifierUserInvitationDTO verifierUserInvitation = VerifierUserInvitationDTO.builder().email("email").build();
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setId(userId);

        when(verifierUserMapper.toUserRepresentation(verifierUserInvitation)).thenReturn(userRepresentation);
        when(userRegistrationService.saveInvitedUser(userRepresentation, RoleType.VERIFIER)).thenReturn(userId);

        String actualUserId = service.saveInvitedUser(verifierUserInvitation);

        assertThat(actualUserId).isEqualTo(userId);

        verify(verifierUserMapper, times(1)).toUserRepresentation(verifierUserInvitation);
        verify(userRegistrationService, times(1)).saveInvitedUser(userRepresentation, RoleType.VERIFIER);
    }

    private UserRepresentation createUserRepresentation(String id, String email) {
        UserRepresentation user = new UserRepresentation();
        user.setId(id);
        user.setEmail(email);
        user.setUsername(email);
        return user;
    }

    private VerifierUserDTO createVerifierUserDTO(String email) {
        return VerifierUserDTO.builder()
                .email(email)
                .firstName("firstName")
                .lastName("lastName")
                .phoneNumber("2101313131")
                .status(REGISTERED)
                .termsVersion((short) 1)
                .build();
    }
}
