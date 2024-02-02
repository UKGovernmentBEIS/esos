package uk.gov.esos.api.authorization.rules.services.resource;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.rules.domain.ResourceScopePermission;
import uk.gov.esos.api.authorization.rules.domain.ResourceType;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.services.ResourceScopePermissionService;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CompAuthAuthorizationResourceServiceTest {

    @InjectMocks
    private CompAuthAuthorizationResourceService service;
    
    @Mock
    private ResourceScopePermissionService resourceScopePermissionService;
    
    @Mock
    private AppAuthorizationService appAuthorizationService;
    
    @Test
    void hasUserScopeToCompAuth() {
    	RoleType roleType = RoleType.OPERATOR;
    	CompetentAuthorityEnum compAuth = CompetentAuthorityEnum.ENGLAND;
    	AppUser authUser = AppUser.builder()
    			.authorities(List.of(AppAuthority.builder().competentAuthority(compAuth).build()))
    			.roleType(roleType).build();
    	
        Scope scope = Scope.EDIT_USER;
        
        ResourceScopePermission resourceScopePermission = 
                ResourceScopePermission.builder().permission(Permission.PERM_CA_USERS_EDIT).build();
        
        when(resourceScopePermissionService.findByResourceTypeAndRoleTypeAndScope(ResourceType.CA, roleType, scope))
            .thenReturn(Optional.of(resourceScopePermission));
        
        boolean result = service.hasUserScopeToCompAuth(authUser, scope);
        
        assertThat(result).isTrue();
        ArgumentCaptor<AuthorizationCriteria> criteriaCaptor = ArgumentCaptor.forClass(AuthorizationCriteria.class);
        verify(resourceScopePermissionService, times(1)).findByResourceTypeAndRoleTypeAndScope(ResourceType.CA, roleType, scope);
        verify(appAuthorizationService, times(1)).authorize(Mockito.eq(authUser), criteriaCaptor.capture());
        AuthorizationCriteria criteriaCaptured = criteriaCaptor.getValue();
        assertThat(criteriaCaptured.getCompetentAuthority()).isEqualTo(compAuth);
        assertThat(criteriaCaptured.getPermission()).isEqualTo(resourceScopePermission.getPermission());
    }
    
    @Test
    void hasUserScopeToCompAuth_not_authorized() {
    	RoleType roleType = RoleType.OPERATOR;
        CompetentAuthorityEnum compAuth = CompetentAuthorityEnum.ENGLAND;
        AppUser authUser = AppUser.builder()
    			.authorities(List.of(AppAuthority.builder().competentAuthority(compAuth).build()))
    			.roleType(roleType).build();
        Scope scope = Scope.EDIT_USER;
        
        ResourceScopePermission resourceScopePermission = 
                ResourceScopePermission.builder().permission(Permission.PERM_CA_USERS_EDIT).build();
        
        AuthorizationCriteria authCriteria = 
                AuthorizationCriteria.builder()
                    .competentAuthority(compAuth)
                    .permission(Permission.PERM_CA_USERS_EDIT).build();
        
        when(resourceScopePermissionService.findByResourceTypeAndRoleTypeAndScope(ResourceType.CA, roleType, scope))
            .thenReturn(Optional.of(resourceScopePermission));
        
        doThrow(BusinessException.class).when(appAuthorizationService).authorize(authUser, authCriteria);
        
        boolean result = service.hasUserScopeToCompAuth(authUser, scope);
        
        assertThat(result).isFalse();
        verify(resourceScopePermissionService, times(1)).findByResourceTypeAndRoleTypeAndScope(ResourceType.CA, roleType, scope);
        ArgumentCaptor<AuthorizationCriteria> criteriaCaptor = ArgumentCaptor.forClass(AuthorizationCriteria.class);
        verify(appAuthorizationService, times(1)).authorize(Mockito.eq(authUser), criteriaCaptor.capture());
        AuthorizationCriteria criteriaCaptured = criteriaCaptor.getValue();
        assertThat(criteriaCaptured.getCompetentAuthority()).isEqualTo(compAuth);
        assertThat(criteriaCaptured.getPermission()).isEqualTo(resourceScopePermission.getPermission());
    }
    
    @Test
    void hasUserScopeOnResourceSubType() {
    	RoleType roleType = RoleType.REGULATOR;
    	CompetentAuthorityEnum compAuth = CompetentAuthorityEnum.ENGLAND;
    	AppUser authUser = AppUser.builder()
    			.authorities(List.of(AppAuthority.builder().competentAuthority(compAuth).build()))
    			.roleType(roleType).build();
        Scope scope = Scope.REQUEST_CREATE;
        String resourceSubType = RequestType.ORGANISATION_ACCOUNT_OPENING.name();
        
        ResourceScopePermission resourceScopePermission = 
                ResourceScopePermission.builder().permission(Permission.PERM_ORGANISATION_ACCOUNT_OPENING_ARCHIVE_EXECUTE_TASK).build();
        
        when(resourceScopePermissionService.findByResourceTypeAndResourceSubTypeAndRoleTypeAndScope(ResourceType.CA, resourceSubType, roleType, scope))
            .thenReturn(Optional.of(resourceScopePermission));
        
        boolean result = service.hasUserScopeOnResourceSubType(authUser, scope, resourceSubType);
        
        assertThat(result).isTrue();
        ArgumentCaptor<AuthorizationCriteria> criteriaCaptor = ArgumentCaptor.forClass(AuthorizationCriteria.class);
        verify(resourceScopePermissionService, times(1)).findByResourceTypeAndResourceSubTypeAndRoleTypeAndScope(ResourceType.CA, resourceSubType, roleType, scope);
        verify(appAuthorizationService, times(1)).authorize(Mockito.eq(authUser), criteriaCaptor.capture());
        AuthorizationCriteria criteriaCaptured = criteriaCaptor.getValue();
        assertThat(criteriaCaptured.getCompetentAuthority()).isEqualTo(compAuth);
        assertThat(criteriaCaptured.getPermission()).isEqualTo(resourceScopePermission.getPermission());
    }
    
    @Test
    void hasUserScopeOnResourceSubType_not_authorized() {
    	RoleType roleType = RoleType.REGULATOR;
    	CompetentAuthorityEnum compAuth = CompetentAuthorityEnum.ENGLAND;
    	AppUser authUser = AppUser.builder()
    			.authorities(List.of(AppAuthority.builder().competentAuthority(compAuth).build()))
    			.roleType(roleType).build();
        Scope scope = Scope.REQUEST_CREATE;
        String resourceSubType = RequestType.ORGANISATION_ACCOUNT_OPENING.name();
        
        ResourceScopePermission resourceScopePermission = 
                ResourceScopePermission.builder().permission(Permission.PERM_ORGANISATION_ACCOUNT_OPENING_ARCHIVE_EXECUTE_TASK).build();
        
        AuthorizationCriteria authCriteria = 
                AuthorizationCriteria.builder()
                    .competentAuthority(compAuth)
                    .permission(Permission.PERM_ORGANISATION_ACCOUNT_OPENING_ARCHIVE_EXECUTE_TASK).build();
        
        when(resourceScopePermissionService.findByResourceTypeAndResourceSubTypeAndRoleTypeAndScope(ResourceType.CA, resourceSubType, roleType, scope))
            .thenReturn(Optional.of(resourceScopePermission));
        
        doThrow(BusinessException.class).when(appAuthorizationService).authorize(authUser, authCriteria);
        
        boolean result = service.hasUserScopeOnResourceSubType(authUser, scope, resourceSubType);
        
        assertThat(result).isFalse();
        verify(resourceScopePermissionService, times(1)).findByResourceTypeAndResourceSubTypeAndRoleTypeAndScope(ResourceType.CA, resourceSubType, roleType, scope);
        ArgumentCaptor<AuthorizationCriteria> criteriaCaptor = ArgumentCaptor.forClass(AuthorizationCriteria.class);
        verify(appAuthorizationService, times(1)).authorize(Mockito.eq(authUser), criteriaCaptor.capture());
        AuthorizationCriteria criteriaCaptured = criteriaCaptor.getValue();
        assertThat(criteriaCaptured.getCompetentAuthority()).isEqualTo(compAuth);
        assertThat(criteriaCaptured.getPermission()).isEqualTo(resourceScopePermission.getPermission());
    }
}
