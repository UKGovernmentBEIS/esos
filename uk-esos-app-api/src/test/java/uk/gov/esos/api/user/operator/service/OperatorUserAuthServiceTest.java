package uk.gov.esos.api.user.operator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus;
import uk.gov.esos.api.user.core.domain.enumeration.KeycloakUserAttributes;
import uk.gov.esos.api.user.core.service.auth.AuthService;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserRegistrationDTO;
import uk.gov.esos.api.user.operator.transform.OperatorUserMapper;
import uk.gov.esos.api.user.operator.transform.OperatorUserRegistrationMapper;

@ExtendWith(MockitoExtension.class)
class OperatorUserAuthServiceTest {

	@InjectMocks
    private OperatorUserAuthService service;

	@Mock
	private AuthService authService;

	@Mock
	private OperatorUserMapper operatorUserMapper;

	@Mock
	private OperatorUserRegistrationMapper operatorUserRegistrationMapper;

	@Spy
	private Clock fixedClock = Clock.fixed(Instant.now(), ZoneId.of("UTC"));

	@Test
	void getOperatorUserById() {
		String email = "email";
		String firstName = "firstName";
		String lastName = "lastName";
		String userId = "userId";
		OperatorUserDTO operatorUserDTO =
				OperatorUserDTO.builder().email(email).firstName(firstName).lastName(lastName).build();
		UserRepresentation userRepresentation = createUserRepresentation(userId, email, "username");

		when(authService.getUserRepresentationById(userId)).thenReturn(userRepresentation);
		when(operatorUserMapper.toOperatorUserDTO(userRepresentation)).thenReturn(operatorUserDTO);

		//invoke
		OperatorUserDTO result = service.getOperatorUserById(userId);

		assertThat(result).isEqualTo(operatorUserDTO);
		verify(authService, times(1)).getUserRepresentationById(userId);
		verify(operatorUserMapper, times(1)).toOperatorUserDTO(userRepresentation);
	}
	
	@Test
	void registerUser() {
		OperatorUserRegistrationDTO operatorUserRegistrationDTO = OperatorUserRegistrationDTO.builder()
				.firstName("fn")
				.build();
		String email = "email@email";
		
		
		UserRepresentation userRepresentation = createUserRepresentation("userId", email, "username");
		
		OperatorUserDTO operatorUserDTO = OperatorUserDTO.builder().email("email").build();
		
		when(operatorUserRegistrationMapper.toUserRepresentation(operatorUserRegistrationDTO, email))
				.thenReturn(userRepresentation);
		when(operatorUserMapper.toOperatorUserDTO(any()))
			.thenReturn(operatorUserDTO);
		
		OperatorUserDTO result = service.registerUser(operatorUserRegistrationDTO, email);
		
		verify(operatorUserRegistrationMapper, times(1)).toUserRepresentation(operatorUserRegistrationDTO, email);
		ArgumentCaptor<UserRepresentation> userCaptor = ArgumentCaptor.forClass(UserRepresentation.class);
        verify(authService, times(1)).saveUser(userCaptor.capture());
        UserRepresentation userSaved = userCaptor.getValue();
		assertThat(userSaved.getAttributes()).containsEntry(KeycloakUserAttributes.USER_STATUS.getName(),
				List.of(AuthenticationStatus.REGISTERED.name()));
		assertThat(result).isEqualTo(operatorUserDTO);
	}

	@Test
	void createOperatorUserAsPending() {
		String email = "email";
		String firstName = "firstName";
		String lastName = "lastName";
		UserRepresentation userRepresentation = new UserRepresentation();
		userRepresentation.setEmail(email);
		userRepresentation.setFirstName(firstName);
		userRepresentation.setLastName(lastName);

		// mock
		when(operatorUserMapper.toUserRepresentation(email, firstName, lastName)).thenReturn(userRepresentation);
		when(authService.createUserWithStatusPending(userRepresentation)).thenReturn("user");
		// invoke
		String actualUserId = service.createOperatorUserAsPending(email, firstName, lastName);

		//assert
		assertThat(actualUserId).isEqualTo("user");

		// verify mocks
		verify(operatorUserMapper, times(1)).toUserRepresentation(email, firstName, lastName);
		verify(authService, times(1)).createUserWithStatusPending(userRepresentation);
	}

	@Test
	void updateOperatorUser() {
		String userId = "user";
		String username = "username";
		UserRepresentation userRepresentation = createUserRepresentation(userId, "email1", username);
		UserRepresentation userRepresentationUpdated = createUserRepresentation(userId, "email2", username);

		OperatorUserDTO operatorUserDTO =
				OperatorUserDTO.builder().email("email2").firstName("fn").lastName("ln").build();

		when(authService.getUserRepresentationById(userId)).thenReturn(userRepresentation);
		when(operatorUserMapper.toUserRepresentation(operatorUserDTO, userId, userRepresentation.getUsername(),
				userRepresentation.getEmail(), userRepresentation.getAttributes())).thenReturn(userRepresentationUpdated);

		//invoke
		service.updateOperatorUser(userId, operatorUserDTO);

		verify(authService, times(1)).getUserRepresentationById(userId);
		verify(operatorUserMapper, times(1)).toUserRepresentation(operatorUserDTO, userId,
				userRepresentation.getUsername(), userRepresentation.getEmail(), userRepresentation.getAttributes());
		verify(authService, times(1)).saveUser(userRepresentationUpdated);
	}

    

	private UserRepresentation createUserRepresentation(String id, String email, String username) {
		UserRepresentation user = new UserRepresentation();
		user.setId(id);
		user.setEmail(email);
		user.setUsername(username);
		user.setEnabled(false);
		return user;
	}

}
