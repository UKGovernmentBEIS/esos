package uk.gov.esos.api.web.controller.authorization.orchestrator;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityDTO;
import uk.gov.esos.api.authorization.core.service.AuthorityService;
import uk.gov.esos.api.web.controller.authorization.orchestrator.dto.LoginStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAuthorityQueryOrchestrator {

//    private final UserAuthService userAuthService;
    private final AuthorityService authorityService;

    public LoginStatus getUserLoginStatusInfo(String userId) {
        List<AuthorityDTO> userAuthorities = authorityService.getAuthoritiesByUserId(userId);

        if (!userAuthorities.isEmpty()) {
            List<AuthorityDTO> activeUserAuthorities = getActiveUserAuthorities(userAuthorities);

            if(!activeUserAuthorities.isEmpty()) {
                List<AuthorityDTO> activeUserAuthoritiesWithPermissions = getActiveUserAuthoritiesWithPermissions(activeUserAuthorities);

                // If user has only active authorities that do not have permissions assigned then return NO_AUTHORITY
                return activeUserAuthoritiesWithPermissions.isEmpty()
                        ? LoginStatus.NO_AUTHORITY
                        : LoginStatus.ENABLED;

            } else {
                // If user has authorities, but none active
                if(userAuthorities.stream()
                        .anyMatch(ua -> ua.getStatus().equals(AuthorityStatus.ACCEPTED))){
                    return LoginStatus.ACCEPTED;
                }

                return LoginStatus.DISABLED;
            }
        } else {
        	return LoginStatus.NO_AUTHORITY;
        }
    }

    private List<AuthorityDTO> getActiveUserAuthorities(List<AuthorityDTO> userAuthorities) {
        return userAuthorities.stream()
                .filter(au -> au.getStatus().equals(AuthorityStatus.ACTIVE)).toList();
    }

    private List<AuthorityDTO> getActiveUserAuthoritiesWithPermissions(List<AuthorityDTO> activeUserAuthorities) {
        return activeUserAuthorities.stream()
                .filter(au -> !au.getAuthorityPermissions().isEmpty())
                .toList();
    }
}
