package uk.gov.esos.api.user.operator.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.service.AccountQueryService;
import uk.gov.esos.api.authorization.core.service.UserRoleTypeService;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus;
import uk.gov.esos.api.user.operator.domain.OperatorUserInvitationDTO;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExistingOperatorUserInvitationServiceTest {

    @InjectMocks
    private ExistingOperatorUserInvitationService existingOperatorUserInvitationService;

    @Mock
    private UserRoleTypeService userRoleTypeService;
    
    @Mock
    private OperatorUserAuthService operatorUserAuthService;

    @Mock
    private OperatorAuthorityService operatorAuthorityService;
    
    @Mock
    private AccountQueryService accountQueryService;

    @Mock
    private OperatorUserNotificationGateway operatorUserNotificationGateway;
    
    @Test
    void addExistingOperatorUserToAccount_when_user_registered_and_existing_role_type_operator() {
        String email = "email";
        String roleCode = "roleCode";
        String userId = "userId";
        Long accountId = 1L;
        String accountName = "accountName";
        String authorityUuid = "authorityUuid";
        AppUser currentUser = AppUser.builder().userId("current_user_id").build();
        OperatorUserInvitationDTO operatorUserInvitationDTO = createOperatorUserInvitationDTO(email, roleCode);

        when(userRoleTypeService.isUserOperator(userId)).thenReturn(true);
        when(operatorAuthorityService.createPendingAuthorityForOperator(accountId, roleCode, userId, currentUser))
            .thenReturn(authorityUuid);
        when(accountQueryService.getAccountName(accountId))
            .thenReturn(accountName);

        existingOperatorUserInvitationService
            .addExistingUserToAccount(operatorUserInvitationDTO, accountId, userId, AuthenticationStatus.REGISTERED, currentUser);

        verify(userRoleTypeService, times(1)).isUserOperator(userId);
        verify(operatorUserAuthService, times(1)).updateUser(operatorUserInvitationDTO);
        verify(operatorAuthorityService, times(1)).createPendingAuthorityForOperator(accountId, roleCode, userId, currentUser);
        verify(accountQueryService, times(1)).getAccountName(accountId);
        verify(operatorUserNotificationGateway, times(1)).notifyInvitedUser(operatorUserInvitationDTO, accountName, authorityUuid);
    }

    @Test
    void addExistingOperatorUserToAccountThrowsException_when_existing_role_type_not_operator() {
        String email = "email";
        String roleCode = "roleCode";
        String userId = "userId";
        Long accountId = 1L;
        AppUser currentUser = AppUser.builder().userId("current_user_id").build();
        OperatorUserInvitationDTO operatorUserInvitationDTO = createOperatorUserInvitationDTO(email, roleCode);

        when(userRoleTypeService.isUserOperator(userId)).thenReturn(false);

        BusinessException businessException = assertThrows(BusinessException.class, () -> existingOperatorUserInvitationService
            .addExistingUserToAccount(operatorUserInvitationDTO, accountId, userId, AuthenticationStatus.REGISTERED, currentUser));

        assertEquals(ErrorCode.USER_ALREADY_REGISTERED, businessException.getErrorCode());

        verify(userRoleTypeService, times(1)).isUserOperator(userId);
        verify(operatorAuthorityService, never()).createPendingAuthorityForOperator(anyLong(), anyString(), anyString(), any());
        verify(operatorUserNotificationGateway, never()).notifyInvitedUser(Mockito.any(), anyString(), anyString());
    }

    private OperatorUserInvitationDTO createOperatorUserInvitationDTO(String email, String roleCode) {
        return OperatorUserInvitationDTO.builder()
            .email(email)
            .roleCode(roleCode)
            .build();
    }

}