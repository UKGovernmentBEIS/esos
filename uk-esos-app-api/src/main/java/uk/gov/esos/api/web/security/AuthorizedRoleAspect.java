package uk.gov.esos.api.web.security;

import java.lang.reflect.Method;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

@Aspect
@Component
@RequiredArgsConstructor
public class AuthorizedRoleAspect {

    private final RoleAuthorizationService roleAuthorizationService;
    private final AuthorizationAspectUserResolver authorizationAspectUserResolver;

    @Before("@annotation(uk.gov.esos.api.web.security.AuthorizedRole)")
    public void authorize(JoinPoint joinPoint) {
        RoleType[] roleTypes = getRoleTypes(joinPoint);
        boolean authoritiesRequired = getAuthoritiesRequired(joinPoint);
        AppUser user = authorizationAspectUserResolver.getUser(joinPoint);
        roleAuthorizationService.evaluate(user, roleTypes, authoritiesRequired);
    }

    private RoleType[] getRoleTypes(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        AuthorizedRole authorizedRole = method.getAnnotation(AuthorizedRole.class);
        return authorizedRole.roleType();
    }
    
    private boolean getAuthoritiesRequired(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        AuthorizedRole authorizedRole = method.getAnnotation(AuthorizedRole.class);
        return authorizedRole.authoritiesRequired();
    }
}
