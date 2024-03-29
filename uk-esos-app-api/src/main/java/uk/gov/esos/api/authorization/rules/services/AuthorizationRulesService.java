package uk.gov.esos.api.authorization.rules.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.repository.AuthorizationRuleRepository;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
class AuthorizationRulesService {

    private final AuthorizationRuleRepository authorizationRuleRepository;
    private final Map<String, AuthorizationResourceRuleHandler> authorizationResourceRuleHandlers;
    private final Map<String, AuthorizationRuleHandler> authorizationRuleHandlers;

    /**
     * Fetches the rules of the service,
     * filters based on the user's {@link uk.gov.esos.api.common.domain.enumeration.RoleType}
     * groups the rules based on the {@link AuthorizationResourceRuleHandler} name
     * and triggers evaluation of rules for all groups.
     *
     * @param user the authenticated user
     * @param service the service name to run rules for.
     * @param resourceId the resourceId for which the rules apply.
     * @throws BusinessException {@link ErrorCode} FORBIDDEN if authorization fails.
     */
    public void evaluateRules(AppUser user, String service, String resourceId) {
    	evaluateRules(user, service, resourceId, null);
    }
    
    public void evaluateRules(AppUser user, String service, String resourceId, String resourceSubType) {
        Map<String, Set<AuthorizationRuleScopePermission>> rules = getAuthorizationServiceRules(user, service, resourceSubType);
        rules.forEach((key, value) -> authorizationResourceRuleHandlers.get(key).evaluateRules(value, user, resourceId));
    }

    /**
     * Fetches the rules of the service,
     * filters based on the user's {@link uk.gov.esos.api.common.domain.enumeration.RoleType}
     * groups the rules based on the {@link AuthorizationRuleHandler} name
     * and triggers evaluation of rules for all groups.
     *
     * @param user the authenticated user
     * @param service the service name to run rules for.
     * @throws BusinessException {@link ErrorCode} FORBIDDEN if authorization fails.
     */
    public void evaluateRules(AppUser user, String service) {
        Map<String, Set<AuthorizationRuleScopePermission>> rules = getAuthorizationServiceRules(user, service);
        rules.forEach((key, value) -> authorizationRuleHandlers.get(key).evaluateRules(value, user));
    }

    
    private Map<String, Set<AuthorizationRuleScopePermission>> getAuthorizationServiceRules(AppUser user, String service) {
		return getAuthorizationServiceRules(user, service, null);
    }

    private Map<String, Set<AuthorizationRuleScopePermission>> getAuthorizationServiceRules(AppUser user, String service, String resourceSubType) {
		final List<AuthorizationRuleScopePermission> rules = resourceSubType != null
				? authorizationRuleRepository.findRulePermissionsByServiceAndRoleTypeAndResourceSubType(service,
						user.getRoleType(), resourceSubType)
				: authorizationRuleRepository.findRulePermissionsByServiceAndRoleType(service, user.getRoleType());

        if(rules.isEmpty()) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        return rules
                .stream()
                .collect(Collectors.groupingBy(AuthorizationRuleScopePermission::getHandler, Collectors.toSet()));
    }

}
