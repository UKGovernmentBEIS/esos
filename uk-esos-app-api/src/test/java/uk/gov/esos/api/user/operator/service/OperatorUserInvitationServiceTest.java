package uk.gov.esos.api.user.operator.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.user.operator.domain.OperatorUserInvitationDTO;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

@ExtendWith(MockitoExtension.class)
class OperatorUserInvitationServiceTest {

    @InjectMocks
    private OperatorUserInvitationService service;

    @Mock
    private UserAuthService authUserService;

    @Mock
    private OperatorUserRegistrationService operatorUserRegistrationService;

    @Mock
    private ExistingOperatorUserInvitationService existingOperatorUserInvitationService;

    @Test
    void addOperatorUserToAccountWhenUserNotExists() {
        String operatorUserRoleCode = "operator";
        String email = "email";
        Long accountId = 1L;
        String currentUserId = "currentUserId";
        AppUser currentUser = createPmrvUser(currentUserId, RoleType.OPERATOR);
        OperatorUserInvitationDTO
            operatorUserInvitationDTO = createOperatorUserInvitationDTO(email, operatorUserRoleCode);

        when(authUserService.getUserByEmail(email)).thenReturn(Optional.empty());

        service.inviteUserToAccount(accountId, operatorUserInvitationDTO, currentUser);

        verify(authUserService, times(1)).getUserByEmail(email);
        verify(operatorUserRegistrationService, times(1))
            .createUserToAccountWithStatusPending(operatorUserInvitationDTO, accountId, currentUser);
        verify(existingOperatorUserInvitationService, never()).addExistingUserToAccount(any(), anyLong(), anyString(), any(), any());
    }

    @Test
    void addOperatorUserToAccountWhenUserAlreadyExists() {
        String operatorUserRoleCode = "operator";
        String email = "email";
        Long accountId = 1L;
        String currentUserId = "currentUserId";
        String operatorUserId = "operatorUserId";
        AppUser currentUser = createPmrvUser(currentUserId, RoleType.OPERATOR);
        OperatorUserInvitationDTO
            operatorUserInvitationDTO = createOperatorUserInvitationDTO(email, operatorUserRoleCode);
        UserInfoDTO userInfoDTO = createUserInfoDTO(operatorUserId, AuthenticationStatus.REGISTERED);

        when(authUserService.getUserByEmail(email)).thenReturn(Optional.of(userInfoDTO));

        service.inviteUserToAccount(accountId, operatorUserInvitationDTO, currentUser);

        verify(authUserService, times(1)).getUserByEmail(email);
        verify(operatorUserRegistrationService, never()).createUserToAccountWithStatusPending(any(), anyLong(), any());
        verify(existingOperatorUserInvitationService, times(1))
            .addExistingUserToAccount(operatorUserInvitationDTO, accountId, operatorUserId, AuthenticationStatus.REGISTERED, currentUser);
    }
    
    private AppUser createPmrvUser(String userId, RoleType roleType) {
        return AppUser.builder().userId(userId).roleType(roleType).build();
    }

    private OperatorUserInvitationDTO createOperatorUserInvitationDTO(String email, String roleCode) {
        return OperatorUserInvitationDTO.builder()
            .email(email)
            .roleCode(roleCode)
            .build();
    }

    private UserInfoDTO createUserInfoDTO(String userId, AuthenticationStatus authenticationStatus) {
    	UserInfoDTO user = new UserInfoDTO();
    	user.setUserId(userId);
        user.setStatus(authenticationStatus);
        return user;
    }
}