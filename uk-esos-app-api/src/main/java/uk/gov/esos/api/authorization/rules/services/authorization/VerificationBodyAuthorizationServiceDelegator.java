package uk.gov.esos.api.authorization.rules.services.authorization;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.authorization.core.domain.AppUser;

/**
 * Service that delegates verification body related authorization to {@link RoleType} based services.
 */
@Service
@RequiredArgsConstructor
public class VerificationBodyAuthorizationServiceDelegator {

    private final List<VerificationBodyAuthorizationService> verificationBodyAuthorizationServices;

    /**
     * Checks that user has access to verification body.
     * @param user the user to authorize
     * @param verificationBodyId the verification body to check permission on
     * @return if the user is authorized on verification body
     */
    public boolean isAuthorized(AppUser user, Long verificationBodyId) {
        return getUserService(user)
            .map(authorizationService -> authorizationService.isAuthorized(user, verificationBodyId))
            .orElse(false);
    }

    /**
     * Checks that user has access to verification body.
     * @param user the user to authorize.
     * @param verificationBodyId the verification body to check permission on
     * @param permission the {@link Permission} to check
     * @return if the user has the permissions on verification body
     */
    public boolean isAuthorized(AppUser user, Long verificationBodyId, Permission permission) {
        return getUserService(user)
            .map(authorizationService -> authorizationService.isAuthorized(user, verificationBodyId, permission))
            .orElse(false);
    }

    private Optional<VerificationBodyAuthorizationService> getUserService(AppUser user) {
        return verificationBodyAuthorizationServices.stream()
            .filter(authorizationService -> authorizationService.getRoleType().equals(user.getRoleType()))
            .findAny();
    }


}
