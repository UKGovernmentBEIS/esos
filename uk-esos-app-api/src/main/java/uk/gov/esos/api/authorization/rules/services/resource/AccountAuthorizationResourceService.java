package uk.gov.esos.api.authorization.rules.services.resource;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.rules.domain.ResourceScopePermission;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.services.ResourceScopePermissionService;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;

@Service
@RequiredArgsConstructor
public class AccountAuthorizationResourceService {
    
    private final ResourceScopePermissionService resourceScopePermissionService;
    private final AppAuthorizationService appAuthorizationService;

    public boolean hasUserScopeToAccount(AppUser authUser, Long accountId, Scope scope) {
        Permission requiredPermission = 
                resourceScopePermissionService.findByResourceTypeAndRoleTypeAndScope(ResourceType.ACCOUNT, authUser.getRoleType(), scope)
                .map(ResourceScopePermission::getPermission)
                .orElse(null);
        
        AuthorizationCriteria authCriteria = 
                AuthorizationCriteria.builder()
                    .accountId(accountId)
                    .permission(requiredPermission).build();
        try {
            appAuthorizationService.authorize(authUser, authCriteria);
        } catch (BusinessException e) {
            return false;
        }
        
        return true;
    }

    public boolean hasUserScopeToAccountAndResourceSubType(AppUser authUser, Long accountId, Scope scope, String resourceSubType) {
        Permission requiredPermission =
                resourceScopePermissionService
                        .findByResourceTypeAndResourceSubTypeAndRoleTypeAndScope(ResourceType.ACCOUNT,
                                resourceSubType, authUser.getRoleType(), scope)
                        .map(ResourceScopePermission::getPermission)
                        .orElse(null);
        AuthorizationCriteria authCriteria =
                AuthorizationCriteria.builder()
                        .accountId(accountId)
                        .permission(requiredPermission).build();
        try {
            appAuthorizationService.authorize(authUser, authCriteria);
            return true;
        } catch (BusinessException e) {
            return false;
        }
    }
}
