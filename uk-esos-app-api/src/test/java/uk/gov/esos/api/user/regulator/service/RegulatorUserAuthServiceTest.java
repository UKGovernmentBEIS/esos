package uk.gov.esos.api.user.regulator.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus;
import uk.gov.esos.api.user.core.domain.enumeration.KeycloakUserAttributes;
import uk.gov.esos.api.user.core.domain.model.UserDetails;
import uk.gov.esos.api.user.core.service.UserSignatureValidatorService;
import uk.gov.esos.api.user.core.service.auth.AuthService;
import uk.gov.esos.api.user.core.service.auth.UserDetailsSaveException;
import uk.gov.esos.api.user.core.service.auth.UserInvitationService;
import uk.gov.esos.api.user.regulator.domain.RegulatorInvitedUserDetailsDTO;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserDTO;
import uk.gov.esos.api.user.regulator.transform.RegulatorInviteUserMapper;
import uk.gov.esos.api.user.regulator.transform.RegulatorUserMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class RegulatorUserAuthServiceTest {

	@InjectMocks
    private RegulatorUserAuthService service;

	@Mock
	private AuthService authService;
	
	@Mock
	private UserInvitationService userRegistrationService;
	
	@Mock
	private UserSignatureValidatorService userSignatureValidatorService;
	
	@Mock
    private RegulatorUserMapper regulatorUserMapper;
    
    @Mock
    private RegulatorInviteUserMapper regulatorInviteUserMapper;
	
	@Test
    void getRegulatorUserById() {
        String userId = "userId";
        String username = "username";
        
        UserRepresentation userRepresentation = createUserRepresentation(userId, "email1", username);
        UserDetails userDetails = UserDetails.builder()
                .id(userId)
                .signature(FileInfoDTO.builder().name("signature").uuid("signuuid").build())
                .build();
        RegulatorUserDTO regulatorUserDTO = RegulatorUserDTO.builder()
                .firstName("fn").lastName("ln")
                .signature(userDetails.getSignature())
                .build();
        
        when(authService.getUserRepresentationById(userId)).thenReturn(userRepresentation);
        when(authService.getUserDetails(userId)).thenReturn(Optional.of(userDetails));
        when(regulatorUserMapper.toRegulatorUserDTO(userRepresentation, userDetails.getSignature())).thenReturn(regulatorUserDTO);
        
        RegulatorUserDTO result = service.getRegulatorUserById(userId);
        
        assertThat(result).isEqualTo(regulatorUserDTO);
        verify(authService, times(1)).getUserRepresentationById(userId);
        verify(authService, times(1)).getUserDetails(userId);
        verify(regulatorUserMapper, times(1)).toRegulatorUserDTO(userRepresentation, userDetails.getSignature());
    }

	@Test
	void saveInvitedUser() throws UserDetailsSaveException {
		String email = "email";
		RegulatorInvitedUserDetailsDTO regulatorInvitedUserDetailsDTO =
				RegulatorInvitedUserDetailsDTO.builder()
						.email(email).firstName("fn").lastName("ln").jobTitle("jt").phoneNumber("210000").build();
		final String userId = "user";

		UserRepresentation keycloakUser = new UserRepresentation();
		keycloakUser.setEmail(regulatorInvitedUserDetailsDTO.getEmail());
		keycloakUser.setFirstName(regulatorInvitedUserDetailsDTO.getFirstName());
		keycloakUser.setLastName(regulatorInvitedUserDetailsDTO.getLastName());
		keycloakUser.singleAttribute(KeycloakUserAttributes.PHONE_NUMBER.getName(),
				regulatorInvitedUserDetailsDTO.getPhoneNumber());
		keycloakUser.singleAttribute(KeycloakUserAttributes.JOB_TITLE.getName(),
				regulatorInvitedUserDetailsDTO.getJobTitle());
		
		FileDTO signature = FileDTO.builder()
                .fileContent("content".getBytes())
                .fileName("signature")
                .fileSize(1L)
                .fileType("type")
                .build();
		
		when(regulatorInviteUserMapper.toUserRepresentation(regulatorInvitedUserDetailsDTO)).thenReturn(keycloakUser);
		when(userRegistrationService.saveInvitedUser(keycloakUser, RoleType.REGULATOR)).thenReturn(userId);
		
		//invoke
		String userIdFound = service.saveInvitedUser(regulatorInvitedUserDetailsDTO, signature);

		assertThat(userIdFound).isEqualTo(userId);

		verify(userSignatureValidatorService, times(1)).validateSignature(signature);
		verify(regulatorInviteUserMapper, times(1)).toUserRepresentation(regulatorInvitedUserDetailsDTO);
		verify(userRegistrationService, times(1)).saveInvitedUser(keycloakUser, RoleType.REGULATOR);
	}

	@Test
	void updateRegulatorUser() {
		String userId = "user";
		String username = "username";
		UserRepresentation userRepresentation = createUserRepresentation(userId, "email1", username);
		UserRepresentation userRepresentationUpdated = createUserRepresentation(userId, "email2", username);

		RegulatorUserDTO regulatorUserDTO =
				RegulatorUserDTO.builder().email("email2").firstName("fn").lastName("ln").build();
		
		FileDTO signature = FileDTO.builder()
                .fileContent("content".getBytes())
                .fileName("signature")
                .fileSize(1L)
                .fileType("type")
                .build();

		when(authService.getUserRepresentationById(userId)).thenReturn(userRepresentation);
		when(regulatorUserMapper.toUserRepresentation(regulatorUserDTO, userId, userRepresentation.getUsername(),
				userRepresentation.getEmail(), userRepresentation.getAttributes())).thenReturn(userRepresentationUpdated);

		//invoke
		service.updateRegulatorUser(userId, regulatorUserDTO, signature);

		verify(userSignatureValidatorService, times(1)).validateSignature(signature);
		verify(authService, times(1)).getUserRepresentationById(userId);
		verify(regulatorUserMapper, times(1)).toUserRepresentation(regulatorUserDTO, userId,
				userRepresentation.getUsername(), userRepresentation.getEmail(), userRepresentation.getAttributes());
		verify(authService, times(1)).saveUser(userRepresentationUpdated);
	}
	
	@Test
	void registerUser() {
		String userId = "user";
		String username = "username";
		UserRepresentation userRepresentation = createUserRepresentation(userId, "email1", username);

		when(authService.getUserRepresentationById(userId)).thenReturn(userRepresentation);

		//invoke
		service.registerUser(userId);

		verify(authService, times(1)).getUserRepresentationById(userId);
		
		ArgumentCaptor<UserRepresentation> userCaptor = ArgumentCaptor.forClass(UserRepresentation.class);
        verify(authService, times(1)).saveUser(userCaptor.capture());
        var userCaptured = userCaptor.getValue();
        assertThat(userCaptured.getAttributes()).containsEntry(KeycloakUserAttributes.USER_STATUS.getName(), List.of(
        		AuthenticationStatus.REGISTERED.name()
        		));
	}

	private UserRepresentation createUserRepresentation(String id, String email, String username) {
		UserRepresentation user = new UserRepresentation();
		user.setId(id);
		user.setEmail(email);
		user.setUsername(username);
		return user;
	}

}
