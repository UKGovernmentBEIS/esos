package uk.gov.esos.api.authorization.core.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import uk.gov.esos.api.authorization.core.domain.dto.RoleCode;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Set;

/**
 * The role code validator.
 */
@Log4j2
@RequiredArgsConstructor
public class RoleCodeValidator implements ConstraintValidator<RoleCode, String> {

    private final RoleService roleService;

    private RoleType roleType;

    @Override
    public void initialize(RoleCode constraintAnnotation) {
        this.roleType = constraintAnnotation.roleType();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        Set<String> codesByType = roleService.getCodesByType(roleType);
        return codesByType.contains(value);
    }
}
