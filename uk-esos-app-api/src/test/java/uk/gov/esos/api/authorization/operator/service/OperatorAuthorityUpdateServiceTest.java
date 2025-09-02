package uk.gov.esos.api.authorization.operator.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.authorization.AuthorityConstants;
import uk.gov.esos.api.authorization.core.domain.Authority;
import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.core.domain.Role;
import uk.gov.esos.api.authorization.core.repository.AuthorityRepository;
import uk.gov.esos.api.authorization.core.repository.RoleRepository;
import uk.gov.esos.api.authorization.core.service.AuthorityAssignmentService;
import uk.gov.esos.api.authorization.operator.domain.AccountOperatorAuthorityUpdateDTO;
import uk.gov.esos.api.authorization.operator.domain.NewUserActivated;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OperatorAuthorityUpdateServiceTest {
    
	@InjectMocks
	private OperatorAuthorityUpdateService service;
	
	@Mock
	private AuthorityAssignmentService authorityAssignmentService;
	
	@Mock
	private AuthorityRepository authorityRepository;
    
	@Mock
	private RoleRepository roleRepository;
	
	@Mock
    private OperatorAdminExistenceValidator operatorAdminExistenceValidator;

	@Mock
	private OperatorStatusModificationAllowanceValidator operatorStatusModificationAllowanceValidator;
	
	@Spy
    private ArrayList<OperatorAuthorityUpdateValidator> operatorAuthorityUpdateValidators;

    @BeforeEach
    void setUp() {
		operatorAuthorityUpdateValidators.add(operatorAdminExistenceValidator);
		operatorAuthorityUpdateValidators.add(operatorStatusModificationAllowanceValidator);
    }

	@Test
    void updateAccountOperatorAuthorities() {
        String userId = "user";
        Long accountId = 1L;
    	
    	String newRoleCode = "newRole";
    	AuthorityStatus newStatus = AuthorityStatus.DISABLED;
    	List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities = List.of(
    			AccountOperatorAuthorityUpdateDTO.builder().userId(userId).roleCode(newRoleCode).authorityStatus(newStatus).build()
		);
    	Role newRole = Role.builder().code(newRoleCode).name("new role").build();
    	
    	Authority authority = Authority.builder()
    			.accountId(accountId)
    			.code("role")
    			.status(AuthorityStatus.ACTIVE)
    			.build();
		List<Role> operatorRoleCodes = List.of(
			Role.builder().code("role").build(),
			Role.builder().code("newRole").build());

		when(roleRepository.findByType(RoleType.OPERATOR))
			.thenReturn(operatorRoleCodes);
    	when(authorityRepository.findByUserIdAndAccountId(userId, accountId))
    		.thenReturn(Optional.of(authority));
    	when(roleRepository.findByCode(newRoleCode))
    		.thenReturn(Optional.of(newRole));
    	when(authorityAssignmentService.updateAuthorityWithNewRole(authority, newRole))
			.thenReturn(authority);
    	
    	// Invoke
		List<NewUserActivated> res = service.updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId);
    	
    	// Verify
    	verify(roleRepository, times(1)).findByType(RoleType.OPERATOR);
    	verify(authorityRepository, times(1)).findByUserIdAndAccountId(userId, accountId);
    	verify(roleRepository, times(1)).findByCode(newRoleCode);
    	verify(authorityAssignmentService, times(1)).updateAuthorityWithNewRole(authority, newRole);
    	assertThat(authority.getStatus()).isEqualTo(newStatus);
		assertThat(res).isEmpty();
    }

	@Test
	void updateAccountOperatorAuthorities_from_accepted() {
		String userId = "user";
		Long accountId = 1L;

		String newRoleCode = "newRole";
		AuthorityStatus newStatus = AuthorityStatus.ACTIVE;
		List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities = List.of(
				AccountOperatorAuthorityUpdateDTO.builder().userId(userId).roleCode(newRoleCode).authorityStatus(newStatus).build()
		);

		Role newRole = Role.builder().code(newRoleCode).name("new role").build();

		Authority authority = Authority.builder()
				.accountId(accountId)
				.code("role")
				.status(AuthorityStatus.ACCEPTED)
				.build();
		List<Role> operatorRoleCodes = List.of(
				Role.builder().code("role").build(),
				Role.builder().code("newRole").build());

		List<NewUserActivated> expected = List.of(NewUserActivated.builder().userId(userId)
				.roleCode(newRoleCode).build());

		when(roleRepository.findByType(RoleType.OPERATOR))
				.thenReturn(operatorRoleCodes);
		when(authorityRepository.findByUserIdAndAccountId(userId, accountId))
				.thenReturn(Optional.of(authority));
		when(roleRepository.findByCode(newRoleCode))
				.thenReturn(Optional.of(newRole));
		when(authorityAssignmentService.updateAuthorityWithNewRole(authority, newRole))
				.thenReturn(authority);

		// Invoke
		List<NewUserActivated> res = service.updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId);

		// Verify
		verify(roleRepository, times(1)).findByType(RoleType.OPERATOR);
		verify(authorityRepository, times(1)).findByUserIdAndAccountId(userId, accountId);
		verify(roleRepository, times(1)).findByCode(newRoleCode);
		verify(authorityAssignmentService, times(1)).updateAuthorityWithNewRole(authority, newRole);
		assertThat(authority.getStatus()).isEqualTo(newStatus);
		assertThat(res).isEqualTo(expected);
	}

	@Test
	void updateAccountOperatorAuthorities_from_accepted_multiple() {
		Long accountId = 1L;

		NewUserActivated operator1 = NewUserActivated.builder().userId("operator1").roleCode(AuthorityConstants.OPERATOR_ROLE_CODE).build();
		AccountOperatorAuthorityUpdateDTO accountOperator1 = AccountOperatorAuthorityUpdateDTO.builder().userId(operator1.getUserId())
				.roleCode(AuthorityConstants.OPERATOR_ROLE_CODE).authorityStatus(AuthorityStatus.ACTIVE).build();

		NewUserActivated operator2 = NewUserActivated.builder().userId("operator2").roleCode(AuthorityConstants.OPERATOR_ROLE_CODE).build();
		AccountOperatorAuthorityUpdateDTO accountOperator2 = AccountOperatorAuthorityUpdateDTO.builder().userId(operator2.getUserId())
				.roleCode(AuthorityConstants.OPERATOR_ROLE_CODE).authorityStatus(AuthorityStatus.ACTIVE).build();

		List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities = List.of(
				accountOperator1, accountOperator2
		);

		List<NewUserActivated> expected = List.of(operator1, operator2);

		List<Role> operatorRoleCodes = List.of(
				Role.builder().code(AuthorityConstants.OPERATOR_ROLE_CODE).build()
		);

		when(roleRepository.findByType(RoleType.OPERATOR))
				.thenReturn(operatorRoleCodes);
		when(authorityRepository.findByUserIdAndAccountId(operator1.getUserId(), accountId))
				.thenReturn(Optional.of(Authority.builder().accountId(accountId).code(operator1.getRoleCode()).status(AuthorityStatus.ACCEPTED).build()));
		when(authorityRepository.findByUserIdAndAccountId(operator2.getUserId(), accountId))
				.thenReturn(Optional.of(Authority.builder().accountId(accountId).code(operator2.getRoleCode()).status(AuthorityStatus.ACCEPTED).build()));

		// Invoke
		List<NewUserActivated> res = service.updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId);

		// Verify
		verify(roleRepository, times(1)).findByType(RoleType.OPERATOR);
		verify(authorityRepository, times(2)).findByUserIdAndAccountId(anyString(), anyLong());
		verify(roleRepository, never()).findByCode(anyString());
		verify(authorityAssignmentService, never()).updateAuthorityWithNewRole(any(), any());
		assertThat(res).isEqualTo(expected);
		verifyNoMoreInteractions(authorityRepository);
	}
    
    @Test
    void updateAccountOperatorAuthorities_same_role() {
        String userId = "user";
        Long accountId = 1L;
    	
    	String roleCode = "role";
    	AuthorityStatus newStatus = AuthorityStatus.DISABLED;
    	List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities = List.of(
    			AccountOperatorAuthorityUpdateDTO.builder().userId(userId).roleCode(roleCode).authorityStatus(newStatus).build()
    			);

    	Authority authority = Authority.builder()
    			.accountId(accountId)
    			.code(roleCode)
    			.status(AuthorityStatus.ACTIVE)
    			.build();
		List<Role> operatorRoleCodes = List.of(Role.builder().code("role").build());

		when(roleRepository.findByType(RoleType.OPERATOR))
			.thenReturn(operatorRoleCodes);
		when(authorityRepository.findByUserIdAndAccountId(userId, accountId))
			.thenReturn(Optional.of(authority));
    	
    	// Invoke
		List<NewUserActivated> res = service.updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId);
    	
    	// Verify
    	verify(roleRepository, times(1)).findByType(RoleType.OPERATOR);
    	verify(authorityRepository, times(1)).findByUserIdAndAccountId(userId, accountId);
    	verify(roleRepository, never()).findByCode(anyString());
    	verify(authorityAssignmentService, never()).updateAuthorityWithNewRole(any(), any());
    	assertThat(authority.getStatus()).isEqualTo(newStatus);
		assertThat(res).isEmpty();
    }
    
    @Test
    void updateAccountOperatorAuthorities_new_role_not_found() {
        String userId = "user";
        Long accountId = 1L;
    	String newRoleCode = "unknown";
    	AuthorityStatus newStatus = AuthorityStatus.DISABLED;
    	List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities = List.of(
    			AccountOperatorAuthorityUpdateDTO.builder().userId(userId).roleCode(newRoleCode).authorityStatus(newStatus).build()
    			);
    	
		List<Role> operatorRoleCodes = List.of(Role.builder().code("role").build());

		when(roleRepository.findByType(RoleType.OPERATOR)).thenReturn(operatorRoleCodes);

    	// Invoke
		BusinessException exception = assertThrows(BusinessException.class, () ->
			service.updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId));
    	
    	// Verify
		assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.ROLE_INVALID_OPERATOR_ROLE_CODE);
    	verify(roleRepository, times(1)).findByType(RoleType.OPERATOR);
    	verifyNoMoreInteractions(roleRepository);
    	verifyNoInteractions(authorityRepository, authorityAssignmentService);
    }
    
    @Test
    void updateAccountOperatorAuthorities_authority_not_found() {
        String userId = "user";
        Long accountId = 1L;
    	String newRoleCode = "newRole";
    	AuthorityStatus newStatus = AuthorityStatus.DISABLED;
    	List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities = List.of(
    			AccountOperatorAuthorityUpdateDTO.builder().userId(userId).roleCode(newRoleCode).authorityStatus(newStatus).build()
    			);
		List<Role> operatorRoleCodes = List.of(Role.builder().code("newRole").build());

		when(roleRepository.findByType(RoleType.OPERATOR)).thenReturn(operatorRoleCodes);
    	when(authorityRepository.findByUserIdAndAccountId(userId, accountId))
    		.thenReturn(Optional.empty());

		// Invoke
		BusinessException exception = assertThrows(BusinessException.class, () ->
			service.updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId));

    	// Verify
		assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.AUTHORITY_USER_NOT_RELATED_TO_ACCOUNT);
		verify(roleRepository, times(1)).findByType(RoleType.OPERATOR);
		verify(authorityRepository, times(1)).findByUserIdAndAccountId(userId, accountId);
    	verify(authorityRepository, never()).save(any());
		verify(authorityAssignmentService, never()).updateAuthorityWithNewRole(any(), any());
    }

    @Test
    void updateAccountOperatorAuthorities_throws_exception_when_no_operator_admin_exists() {
        String userId = "user";
        Long accountId = 1L;
        String newRoleCode = "newRole";
        AuthorityStatus newStatus = AuthorityStatus.DISABLED;
        List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities = List.of(
            AccountOperatorAuthorityUpdateDTO.builder().userId(userId).roleCode(newRoleCode).authorityStatus(newStatus).build()
        );

		List<Role> operatorRoleCodes = List.of(Role.builder().code("newRole").build());

		when(roleRepository.findByType(RoleType.OPERATOR)).thenReturn(operatorRoleCodes);

        doThrow(new BusinessException(ErrorCode.AUTHORITY_MIN_ONE_OPERATOR_ADMIN_SHOULD_EXIST))
            .when(operatorAdminExistenceValidator).validateUpdate(accountOperatorAuthorities, accountId);

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
            () -> service.updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId));

        assertEquals(ErrorCode.AUTHORITY_MIN_ONE_OPERATOR_ADMIN_SHOULD_EXIST, businessException.getErrorCode());

        // Verify
		verify(roleRepository, times(1)).findByType(RoleType.OPERATOR);
        verify(operatorAdminExistenceValidator, times(1)).validateUpdate(accountOperatorAuthorities, accountId);
        verifyNoMoreInteractions(roleRepository);
		verifyNoInteractions(authorityRepository, authorityAssignmentService);
    }

	@Test
	void updateAccountOperatorAuthorities_throws_exception_when_status_not_applicable() {
		Long accountId = 1L;
		List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities = List.of(
				AccountOperatorAuthorityUpdateDTO.builder().userId("user").roleCode("newRole").authorityStatus(AuthorityStatus.ACTIVE).build()
		);
		List<Role> operatorRoleCodes = List.of(
				Role.builder().code("role").build(),
				Role.builder().code("newRole").build());

		when(roleRepository.findByType(RoleType.OPERATOR)).thenReturn(operatorRoleCodes);

		doThrow(new BusinessException(ErrorCode.AUTHORITY_INVALID_STATUS))
				.when(operatorStatusModificationAllowanceValidator).validateUpdate(accountOperatorAuthorities, accountId);

		// Invoke
		BusinessException businessException = assertThrows(BusinessException.class,
				() -> service.updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId));

		assertEquals(ErrorCode.AUTHORITY_INVALID_STATUS, businessException.getErrorCode());

		// Verify
		verify(roleRepository, times(1)).findByType(RoleType.OPERATOR);
		verify(operatorStatusModificationAllowanceValidator, times(1)).validateUpdate(accountOperatorAuthorities, accountId);
		verifyNoMoreInteractions(roleRepository);
		verifyNoInteractions(authorityRepository, authorityAssignmentService);
	}
    
    @Test
    void updateAccountOperatorAuthorities_empty_list() {
        Long accountId = 1L;
        List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities = List.of(
                );
        
		List<NewUserActivated> res = service.updateAccountOperatorAuthorities(accountOperatorAuthorities, accountId);
        
        // Verify
        verifyNoInteractions(authorityRepository, roleRepository, authorityAssignmentService);
		assertThat(res).isEmpty();
    }
}
