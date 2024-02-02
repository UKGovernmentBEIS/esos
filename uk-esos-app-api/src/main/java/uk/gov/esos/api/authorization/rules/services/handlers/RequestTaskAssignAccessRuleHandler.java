package uk.gov.esos.api.authorization.rules.services.handlers;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.services.AuthorizationResourceRuleHandler;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.RequestTaskAuthorityInfoDTO;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.providers.RequestTaskAuthorityInfoProvider;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;

import java.util.Set;

@Service("requestTaskAssignAccessHandler")
@RequiredArgsConstructor
public class RequestTaskAssignAccessRuleHandler implements AuthorizationResourceRuleHandler {

    private final AppAuthorizationService appAuthorizationService;
    private final RequestTaskAuthorityInfoProvider requestTaskAuthorityInfoProvider;

    /**
     * Evaluates the {@code authorizationRules} on the {@code resourceId}, which must correspond to an existing {@link RequestTask}.
     * @param authorizationRules the list of
     * @param user the authenticated user
     * @param resourceId the resourceId for which the rules apply.
     */
    @Override
    public void evaluateRules(Set<AuthorizationRuleScopePermission> authorizationRules, AppUser user, String resourceId) {
        RequestTaskAuthorityInfoDTO requestTaskInfoDTO = requestTaskAuthorityInfoProvider.getRequestTaskInfo(Long.parseLong(resourceId));
        authorizationRules.forEach(rule -> {
            AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
                .accountId(requestTaskInfoDTO.getAuthorityInfo().getAccountId())
                .competentAuthority(requestTaskInfoDTO.getAuthorityInfo().getCompetentAuthority())
                .verificationBodyId(requestTaskInfoDTO.getAuthorityInfo().getVerificationBodyId())
                .permission(rule.getPermission())
                .build();
            appAuthorizationService.authorize(user, authorizationCriteria);
        });
    }
}
