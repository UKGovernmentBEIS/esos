package uk.gov.esos.api.authorization.operator.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
import java.util.Set;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class OperatorAuthorityUpdateService {
	
	private final List<OperatorAuthorityUpdateValidator> operatorAuthorityUpdateValidators;
	private final AuthorityAssignmentService authorityAssignmentService;
	private final AuthorityRepository authorityRepository;
    private final RoleRepository roleRepository;

    @Transactional
    public List<NewUserActivated> updateAccountOperatorAuthorities(List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorities,
                                                                    Long accountId) {
        if(accountOperatorAuthorities.isEmpty()) {
            return List.of();
        }
        
        // Validate
        validateRoleCodes(accountOperatorAuthorities);
        operatorAuthorityUpdateValidators
            .forEach(operatorAuthorityUpdateValidator -> operatorAuthorityUpdateValidator.validateUpdate(accountOperatorAuthorities, accountId));
        
        // Update authorities
        List<NewUserActivated> notifyUsers = new ArrayList<>();
        accountOperatorAuthorities.forEach(au ->
                Optional.ofNullable(updateAccountOperatorUserAuthority(au, accountId))
                        .ifPresent(notifyUsers::add)
        );

        return notifyUsers;
    }
	
	private NewUserActivated updateAccountOperatorUserAuthority(AccountOperatorAuthorityUpdateDTO operatorUserUpdate, Long accountId) {
        Optional<Authority> authorityOptional =
                authorityRepository.findByUserIdAndAccountId(operatorUserUpdate.getUserId(), accountId);

        if (authorityOptional.isEmpty()) {
            log.error("Authority not found for user id: {} and account id: {}",
                    operatorUserUpdate::getUserId,
                    () -> accountId);
            throw new BusinessException(ErrorCode.AUTHORITY_USER_NOT_RELATED_TO_ACCOUNT);
        }

        Authority authority = authorityOptional.get();
        AuthorityStatus previousStatus = authority.getStatus();

        // Update role
        String newRoleCode = operatorUserUpdate.getRoleCode();
        if (!newRoleCode.equals(authority.getCode())) {
            Optional<Role> newRoleOptional = roleRepository.findByCode(newRoleCode);
            if (newRoleOptional.isEmpty()) {
                log.error("Role not found for code: " + newRoleCode);
            } else {
                authority = authorityAssignmentService.updateAuthorityWithNewRole(authority, newRoleOptional.get());
            }
        }

        // Update status
        authority.setStatus(operatorUserUpdate.getAuthorityStatus());
        
        // Add notification message for enable user from accepted invitation
        if(previousStatus.equals(AuthorityStatus.ACCEPTED)
                && operatorUserUpdate.getAuthorityStatus().equals(AuthorityStatus.ACTIVE)){
            return NewUserActivated.builder().userId(operatorUserUpdate.getUserId())
                    .roleCode(AuthorityConstants.OPERATOR_ROLE_CODE).build();
        }
        return null;
    }
	
	private void validateRoleCodes(List<AccountOperatorAuthorityUpdateDTO> accountUsers) {
        Set<String> newRoleCodes = accountUsers.stream().map(AccountOperatorAuthorityUpdateDTO::getRoleCode).collect(Collectors.toSet());
        Set<String> operatorRoleCodes = roleRepository.findByType(RoleType.OPERATOR)
            .stream()
            .map(Role::getCode)
            .collect(Collectors.toSet());
        if (!operatorRoleCodes.containsAll(newRoleCodes)) {
            List<String> invalidCodes = new ArrayList<>(newRoleCodes);
            invalidCodes.removeAll(operatorRoleCodes);
            throw new BusinessException(ErrorCode.ROLE_INVALID_OPERATOR_ROLE_CODE, invalidCodes);
        }
    }
}
