package uk.gov.esos.api.web.orchestrator.authorization.validate;

import org.springframework.util.ObjectUtils;
import uk.gov.esos.api.web.orchestrator.authorization.dto.AccountOperatorAuthorityUpdateWrapperDTO;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AccountOperatorAuthorityUpdateValidator 
            implements ConstraintValidator<AccountOperatorAuthorityUpdate, AccountOperatorAuthorityUpdateWrapperDTO>{

    @Override
    public boolean isValid(AccountOperatorAuthorityUpdateWrapperDTO dto, ConstraintValidatorContext context) {
        return ! (
                ObjectUtils.isEmpty(dto.getAccountOperatorAuthorityUpdateList()) &&
                ObjectUtils.isEmpty(dto.getContactTypes())
                );
    }

}
