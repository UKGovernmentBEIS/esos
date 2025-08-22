package uk.gov.esos.api.authorization.rules.services;

import org.junit.jupiter.api.Test;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class RoleAuthorizationServiceTest {

    private final RoleAuthorizationService roleAuthorizationService = new RoleAuthorizationService();

    @Test
    void evaluate() {
        AppUser operatorUser = AppUser.builder().userId("userId").roleType(RoleType.OPERATOR).build();
        List<AppAuthority> authorities = List.of(
            AppAuthority.builder().accountId(1L).build()
        );
        operatorUser.setAuthorities(authorities);

        assertDoesNotThrow(() -> roleAuthorizationService.evaluate(operatorUser, new RoleType[] {RoleType.OPERATOR}, true));
    }
    
    @Test
    void evaluate_if_user_has_no_authorities_and_Authorities_not_required() {
        AppUser operatorUser = AppUser.builder().userId("userId").roleType(RoleType.OPERATOR).build();
        List<AppAuthority> authorities = List.of();
        operatorUser.setAuthorities(authorities);

        assertDoesNotThrow(() -> roleAuthorizationService.evaluate(operatorUser, new RoleType[] {RoleType.OPERATOR}, false));
    }

    @Test
    void evaluate_throws_business_exception_if_required_role_type_different() {
        AppUser operatorUser = AppUser.builder().userId("userId").roleType(RoleType.OPERATOR).build();

        BusinessException businessException = assertThrows(BusinessException.class,
            () -> roleAuthorizationService.evaluate(operatorUser, new RoleType[] {RoleType.REGULATOR}, true));

        assertEquals(ErrorCode.FORBIDDEN, businessException.getErrorCode());
    }

    @Test
    void evaluate_throws_business_exception_if_user_has_no_authorities_and_Authorities_required() {
        AppUser operatorUser = AppUser.builder().userId("userId").roleType(RoleType.REGULATOR).build();

        BusinessException businessException = assertThrows(BusinessException.class,
            () -> roleAuthorizationService.evaluate(operatorUser, new RoleType[] {RoleType.REGULATOR}, true));

        assertEquals(ErrorCode.FORBIDDEN, businessException.getErrorCode());
    }

    @Test
    void evaluate_throws_business_exception_if_permitted_role_types_empty() {
        AppUser operatorUser = AppUser.builder().userId("userId").roleType(RoleType.REGULATOR).build();

        BusinessException businessException = assertThrows(BusinessException.class,
            () -> roleAuthorizationService.evaluate(operatorUser, new RoleType[] {}, true));

        assertEquals(ErrorCode.FORBIDDEN, businessException.getErrorCode());
    }
}