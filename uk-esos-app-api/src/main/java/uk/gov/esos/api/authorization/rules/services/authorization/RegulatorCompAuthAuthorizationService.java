package uk.gov.esos.api.authorization.rules.services.authorization;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Service that checks if a REGULATOR user is authorized on a {@link CompetentAuthorityEnum}
 */
@Service
@RequiredArgsConstructor
public class RegulatorCompAuthAuthorizationService implements CompAuthAuthorizationService {
    /**
     * checks that a REGULATOR has access to competentAuthority
     * @param user the user to authorize.
     * @param competentAuthority the {@link CompetentAuthorityEnum} to check permission on.
     * @return if the user is authorized on competentAuthority.
     */
    @Override
    public boolean isAuthorized(AppUser user, CompetentAuthorityEnum competentAuthority) {
        return user.getAuthorities()
                .stream()
                .filter(Objects::nonNull)
                .map(auth -> competentAuthority == auth.getCompetentAuthority())
                .findAny()
                .orElse(false);
    }

    /**
     * checks that a REGULATOR has the permissions to competentAuthority
     * @param user the user to authorize.
     * @param competentAuthority the {@link CompetentAuthorityEnum} to check permission on.
     * @param permission the {@link Permission} to check
     * @return if the user has the permissions on the competentAuthority
     */
    @Override
    public boolean isAuthorized(AppUser user, CompetentAuthorityEnum competentAuthority, Permission permission) {
        return user.getAuthorities()
                .stream()
                .filter(Objects::nonNull)
                .filter(authority -> competentAuthority == authority.getCompetentAuthority())
                .flatMap(authority -> authority.getPermissions().stream())
                .collect(Collectors.toList()).contains(permission);
    }

    @Override
    public RoleType getRoleType() {
        return RoleType.REGULATOR;
    }
}
