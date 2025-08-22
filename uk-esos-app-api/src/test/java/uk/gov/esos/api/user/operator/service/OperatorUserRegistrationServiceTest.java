package uk.gov.esos.api.user.operator.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.service.AccountQueryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityService;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserInvitationDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserRegistrationDTO;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OperatorUserRegistrationServiceTest {

    @InjectMocks
    private OperatorUserRegistrationService service;

    @Mock
    private OperatorUserAuthService operatorUserAuthService;

    @Mock
    private OperatorAuthorityService operatorAuthorityService;

    @Mock
    private AccountQueryService accountQueryService;

    @Mock
    private OperatorUserNotificationGateway operatorUserNotificationGateway;

    @Test
    void createUserToAccountWithStatusPending() {
        String roleCode = "roleCode";
        String userId = "userId";
        Long accountId = 1L;
        String accountName = "accountName";
        String authorityUuid = "authorityUuid";
        AppUser currentUser = AppUser.builder().userId("current_user_id").build();
        OperatorUserInvitationDTO operatorUserInvitationDTO = createOperatorUserInvitationDTO(roleCode);

        when(operatorUserAuthService.createOperatorUserAsPending(
            operatorUserInvitationDTO.getEmail(),
            operatorUserInvitationDTO.getFirstName(),
            operatorUserInvitationDTO.getLastName()))
            .thenReturn(userId);
        when(operatorAuthorityService.createPendingAuthorityForOperator(accountId, roleCode, userId, currentUser))
            .thenReturn(authorityUuid);
        when(accountQueryService.getAccountName(accountId))
            .thenReturn(accountName);

        service.createUserToAccountWithStatusPending(operatorUserInvitationDTO, accountId, currentUser);

        verify(operatorUserAuthService, times(1)).createOperatorUserAsPending(
            operatorUserInvitationDTO.getEmail(),
            operatorUserInvitationDTO.getFirstName(),
            operatorUserInvitationDTO.getLastName());
        verify(operatorAuthorityService, times(1))
            .createPendingAuthorityForOperator(accountId, roleCode, userId, currentUser);
        verify(accountQueryService, times(1)).getAccountName(accountId);
        verify(operatorUserNotificationGateway, times(1)).notifyInvitedUser(
            operatorUserInvitationDTO,
            accountName,
            authorityUuid);
    }

    @Test
    void registerUser() {
    	AppUser currentUser = AppUser.builder().email("email").build();    	
    	OperatorUserRegistrationDTO operatorUserRegistrationDTO = OperatorUserRegistrationDTO.builder()
    			.firstName("fn")
    			.build();
    	
    	OperatorUserDTO operatorUserDTO = OperatorUserDTO.builder().firstName("fn").build();
    	
    	when(operatorUserAuthService.registerUser(operatorUserRegistrationDTO, currentUser.getEmail()))
    		.thenReturn(operatorUserDTO);

    	//invoke
    	OperatorUserDTO result = service.registerUser(operatorUserRegistrationDTO, currentUser);

    	//assert and verify
    	assertThat(result).isEqualTo(operatorUserDTO);

    	verify(operatorUserAuthService, times(1)).registerUser(operatorUserRegistrationDTO, currentUser.getEmail());
    	verify(operatorUserNotificationGateway, times(1)).notifyRegisteredUser(operatorUserDTO);
    }

    @Test
	void sendVerificationEmail() {
    	String email = "email";

		// invoke
		service.sendVerificationEmail(email);

		// verify mocks
		verify(operatorUserNotificationGateway, times(1)).notifyEmailVerification(email);
	}

    private OperatorUserInvitationDTO createOperatorUserInvitationDTO(String roleCode) {
        return OperatorUserInvitationDTO.builder()
            .email("email")
            .roleCode(roleCode)
            .firstName("firstName")
            .lastName("lastName")
            .build();
    }

}