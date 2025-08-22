package uk.gov.esos.api.authorization.operator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.authorization.AuthorityConstants.OPERATOR_ADMIN_ROLE_CODE;
import static uk.gov.esos.api.authorization.AuthorityConstants.OPERATOR_ROLE_CODE;
import static uk.gov.esos.api.authorization.core.domain.AuthorityStatus.ACTIVE;
import static uk.gov.esos.api.authorization.core.domain.AuthorityStatus.DISABLED;
import static uk.gov.esos.api.common.exception.ErrorCode.AUTHORITY_MIN_ONE_OPERATOR_ADMIN_SHOULD_EXIST;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.Authority;
import uk.gov.esos.api.authorization.operator.domain.AccountOperatorAuthorityUpdateDTO;
import uk.gov.esos.api.authorization.core.repository.AuthorityRepository;
import uk.gov.esos.api.common.exception.BusinessException;

@ExtendWith(MockitoExtension.class)
class OperatorAdminExistenceValidatorTest {

    @InjectMocks
    private OperatorAdminExistenceValidator operatorAdminExistenceValidator;

    @Mock
    private AuthorityRepository authorityRepository;

    @Mock
    private OperatorAuthorityService operatorAuthorityService;

    @Test
    void validate_when_at_least_one_active_operator_admin_to_be_updated() {
        List<AccountOperatorAuthorityUpdateDTO> accountOperatorUsers = List.of(
            AccountOperatorAuthorityUpdateDTO.builder().userId("user1").roleCode(OPERATOR_ROLE_CODE).authorityStatus(ACTIVE)
                .build(),
            AccountOperatorAuthorityUpdateDTO.builder().userId("user2").roleCode(OPERATOR_ADMIN_ROLE_CODE).authorityStatus(ACTIVE)
                .build()
        );
        operatorAdminExistenceValidator.validateUpdate(accountOperatorUsers, 1L);

        verifyNoInteractions(operatorAuthorityService);
    }

    @Test
    void validate_when_no_operator_admin_to_be_updated() {
        Long accountId = 1L;
        List<AccountOperatorAuthorityUpdateDTO> accountOperatorUsers = List.of(
            AccountOperatorAuthorityUpdateDTO.builder().userId("user1").roleCode(OPERATOR_ROLE_CODE).authorityStatus(ACTIVE)
                .build()
        );

        List<String> currentActiveOperatorAdmins = List.of("user2");

        when(operatorAuthorityService.findActiveOperatorAdminUsersByAccount(accountId)).thenReturn(currentActiveOperatorAdmins);

        operatorAdminExistenceValidator.validateUpdate(accountOperatorUsers, 1L);

        verify(operatorAuthorityService, times(1)).findActiveOperatorAdminUsersByAccount(accountId);
    }

    @Test
    void validate_when_one_operator_admin_to_be_disabled() {
        Long accountId = 1L;
        List<AccountOperatorAuthorityUpdateDTO> accountOperatorUsers = List.of(
            AccountOperatorAuthorityUpdateDTO.builder().userId("user1").roleCode(OPERATOR_ADMIN_ROLE_CODE).authorityStatus(DISABLED)
                .build()
        );

        List<String> currentActiveOperatorAdmins = List.of("user1", "user2");

        when(operatorAuthorityService.findActiveOperatorAdminUsersByAccount(accountId)).thenReturn(currentActiveOperatorAdmins);

        operatorAdminExistenceValidator.validateUpdate(accountOperatorUsers, 1L);

        verify(operatorAuthorityService, times(1)).findActiveOperatorAdminUsersByAccount(accountId);
    }

    @Test
    void validate_one_operator_admin_to_be_modified() {
        Long accountId = 1L;
        List<AccountOperatorAuthorityUpdateDTO> accountOperatorUsers = List.of(
            AccountOperatorAuthorityUpdateDTO.builder().userId("user1").roleCode(OPERATOR_ROLE_CODE).authorityStatus(ACTIVE)
                .build()
        );

        List<String> currentActiveOperatorAdmins = List.of("user1", "user2");

        when(operatorAuthorityService.findActiveOperatorAdminUsersByAccount(accountId)).thenReturn(currentActiveOperatorAdmins);

        operatorAdminExistenceValidator.validateUpdate(accountOperatorUsers, 1L);

        verify(operatorAuthorityService, times(1)).findActiveOperatorAdminUsersByAccount(accountId);
    }

    @Test
    void validate_when_all_operator_admins_abolished_throws_exception() {
        Long accountId = 1L;
        List<AccountOperatorAuthorityUpdateDTO> accountOperatorUsers = List.of(
            AccountOperatorAuthorityUpdateDTO.builder().userId("user1").roleCode(OPERATOR_ADMIN_ROLE_CODE).authorityStatus(DISABLED)
                .build(),
            AccountOperatorAuthorityUpdateDTO.builder().userId("user2").roleCode(OPERATOR_ROLE_CODE).authorityStatus(ACTIVE)
                .build()
        );

        List<String> currentActiveOperatorAdmins = List.of("user1", "user2");

        when(operatorAuthorityService.findActiveOperatorAdminUsersByAccount(accountId)).thenReturn(currentActiveOperatorAdmins);

        BusinessException businessException =
            assertThrows(BusinessException.class, () -> operatorAdminExistenceValidator.validateUpdate(accountOperatorUsers, 1L));

        assertEquals(AUTHORITY_MIN_ONE_OPERATOR_ADMIN_SHOULD_EXIST, businessException.getErrorCode());
    }

    @Test
    void validateDeletion() {
        Authority authority = Authority.builder()
            .userId("userId")
            .code("operator_user")
            .accountId(1L)
            .build();

        operatorAdminExistenceValidator.validateDeletion(authority);
    }

    @Test
    void validateDeletion_throws_exception() {
        Authority authority = Authority.builder()
            .userId("userId")
            .code("operator_admin")
            .accountId(1L)
            .build();

        when(authorityRepository.existsOtherAccountOperatorAdmin(authority.getUserId(),
            authority.getAccountId())).thenReturn(false);

        BusinessException businessException =
            assertThrows(BusinessException.class,
                () -> operatorAdminExistenceValidator.validateDeletion(authority));

        assertThat(businessException.getErrorCode()).isEqualTo(AUTHORITY_MIN_ONE_OPERATOR_ADMIN_SHOULD_EXIST);
    }
}