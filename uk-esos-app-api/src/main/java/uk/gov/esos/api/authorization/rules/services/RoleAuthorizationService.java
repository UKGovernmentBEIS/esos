package uk.gov.esos.api.authorization.rules.services;

import java.util.Arrays;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

/**
 * Service that authorizes user based only on {@link RoleType}.
 */
@Service
public class RoleAuthorizationService {

    /**
     * Evaluates whether the {@code pmrvUser} has any of the {@code roleTypes}.
     *
     * @param pmrvUser {@link AppUser}
     * @param roleTypes the {@link RoleType} array
     * @param authoritiesRequired
     */
    public void evaluate(AppUser pmrvUser, RoleType[] roleTypes, boolean authoritiesRequired) {
		if (!Arrays.asList(roleTypes).contains(pmrvUser.getRoleType())
				|| (authoritiesRequired && pmrvUser.getAuthorities().isEmpty())) {
			throw new BusinessException(ErrorCode.FORBIDDEN);
		}
    }
}
