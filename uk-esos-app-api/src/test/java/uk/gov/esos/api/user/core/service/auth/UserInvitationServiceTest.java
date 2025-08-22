package uk.gov.esos.api.user.core.service.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.common.exception.ErrorCode.USER_ALREADY_REGISTERED;
import static uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus.REGISTERED;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.authorization.core.domain.dto.UserRoleTypeDTO;
import uk.gov.esos.api.authorization.core.service.UserRoleTypeService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.user.core.domain.enumeration.KeycloakUserAttributes;

@ExtendWith(MockitoExtension.class)
class UserInvitationServiceTest {

    @InjectMocks
    private UserInvitationService cut;

    @Mock
    private AuthService authService;
    
    @Mock
    private UserRoleTypeService userRoleTypeService;
    
    @Test
    void saveInvitedUser_new_user() {
        final String createdUserId = "user";
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setEmail("email");

        when(authService.getByUsername("email")).thenReturn(Optional.empty());
        when(authService.createUserWithStatusPending(userRepresentation)).thenReturn(createdUserId);

        String actualUserId = cut.saveInvitedUser(userRepresentation, RoleType.REGULATOR);

        assertThat(actualUserId).isEqualTo(createdUserId);
        verify(authService, never()).saveUser(any(UserRepresentation.class));
    }
    
    @Test
    void saveInvitedUser_when_invite_different_role_type_from_existing_role() {
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setEmail("email");

        UserRepresentation existingUserRepresentation = new UserRepresentation();
        existingUserRepresentation.setEmail("email");
        existingUserRepresentation.setId("id");
        existingUserRepresentation.singleAttribute(KeycloakUserAttributes.USER_STATUS.getName(), REGISTERED.name());

        when(authService.getByUsername("email")).thenReturn(Optional.of(existingUserRepresentation));
        
		when(userRoleTypeService.getUserRoleTypeByUserIdOpt(existingUserRepresentation.getId()))
				.thenReturn(Optional.of(UserRoleTypeDTO.builder().roleType(RoleType.OPERATOR).build()));

        BusinessException businessException = assertThrows(BusinessException.class,
            () -> cut.saveInvitedUser(existingUserRepresentation, RoleType.REGULATOR));

        assertThat(businessException.getErrorCode()).isEqualTo(USER_ALREADY_REGISTERED);
        verify(authService, times(1)).getByUsername("email");
        verify(userRoleTypeService, times(1)).getUserRoleTypeByUserIdOpt("id");
        verify(authService, never()).saveUser(any(UserRepresentation.class));
    }
    
    @Test
    void saveInvitedUser_when_existing_user_role_is_regulator_throw_exception() {
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setEmail("email");

        UserRepresentation existingUserRepresentation = new UserRepresentation();
        existingUserRepresentation.setEmail("email");
        existingUserRepresentation.setId("id");
        existingUserRepresentation.singleAttribute(KeycloakUserAttributes.USER_STATUS.getName(), REGISTERED.name());

        when(authService.getByUsername("email")).thenReturn(Optional.of(existingUserRepresentation));
        
		when(userRoleTypeService.getUserRoleTypeByUserIdOpt(existingUserRepresentation.getId()))
				.thenReturn(Optional.of(UserRoleTypeDTO.builder().roleType(RoleType.REGULATOR).build()));

        BusinessException businessException = assertThrows(BusinessException.class,
            () -> cut.saveInvitedUser(existingUserRepresentation, RoleType.REGULATOR));

        assertThat(businessException.getErrorCode()).isEqualTo(USER_ALREADY_REGISTERED);
        verify(authService, times(1)).getByUsername("email");
        verify(userRoleTypeService, times(1)).getUserRoleTypeByUserIdOpt("id");
        verify(authService, never()).saveUser(any(UserRepresentation.class));
    }

	@Test
	void saveInvitedUser_when_existing_but_with_no_authentication_status_attribute() {
		UserRepresentation userRepresentation = new UserRepresentation();
		userRepresentation.setEmail("email");

		UserRepresentation existingUserRepresentation = new UserRepresentation();
		existingUserRepresentation.setEmail("email");
		existingUserRepresentation.setId("id");
		existingUserRepresentation.singleAttribute(KeycloakUserAttributes.JOB_TITLE.getName(), "mr");

		when(authService.getByUsername("email")).thenReturn(Optional.of(existingUserRepresentation));

		when(userRoleTypeService.getUserRoleTypeByUserIdOpt(existingUserRepresentation.getId()))
				.thenReturn(Optional.empty());

		BusinessException businessException = assertThrows(BusinessException.class,
				() -> cut.saveInvitedUser(existingUserRepresentation, RoleType.OPERATOR));

		assertThat(businessException.getErrorCode()).isEqualTo(ErrorCode.INTERNAL_SERVER);
		verify(authService, times(1)).getByUsername("email");
		verify(userRoleTypeService, times(1)).getUserRoleTypeByUserIdOpt("id");
		verify(authService, never()).saveUser(any(UserRepresentation.class));
	}
	
	@Test
	void saveInvitedUser_existing_user_and_role_Type_OPERATOR() {
		UserRepresentation userRepresentation = new UserRepresentation();
		userRepresentation.setEmail("email");

		UserRepresentation existingUserRepresentation = new UserRepresentation();
		existingUserRepresentation.setEmail("email");
		existingUserRepresentation.setId("id");
		existingUserRepresentation.singleAttribute(KeycloakUserAttributes.USER_STATUS.getName(), REGISTERED.name());

		when(authService.getByUsername("email")).thenReturn(Optional.of(existingUserRepresentation));

		when(userRoleTypeService.getUserRoleTypeByUserIdOpt(existingUserRepresentation.getId()))
				.thenReturn(Optional.of(UserRoleTypeDTO.builder().roleType(RoleType.OPERATOR).build()));

		cut.saveInvitedUser(userRepresentation, RoleType.OPERATOR);

		verify(authService, times(1)).getByUsername("email");
		verify(userRoleTypeService, times(1)).getUserRoleTypeByUserIdOpt("id");
		verify(authService, times(1)).saveUser(userRepresentation);
	}
}