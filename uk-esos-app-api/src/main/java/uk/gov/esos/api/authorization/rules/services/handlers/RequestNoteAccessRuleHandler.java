package uk.gov.esos.api.authorization.rules.services.handlers;

import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.services.AuthorizationResourceRuleHandler;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.RequestAuthorityInfoDTO;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.providers.RequestNoteAuthorityInfoProvider;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;


@Service("requestNoteAccessHandler")
@RequiredArgsConstructor
public class RequestNoteAccessRuleHandler implements AuthorizationResourceRuleHandler {

    private final AppAuthorizationService appAuthorizationService;
    private final RequestNoteAuthorityInfoProvider requestNoteAuthorityInfoProvider;

    @Override
    public void evaluateRules(final Set<AuthorizationRuleScopePermission> authorizationRules,
                              final AppUser user,
                              final String resourceId) {

        final RequestAuthorityInfoDTO requestInfo =
            requestNoteAuthorityInfoProvider.getRequestNoteInfo(Long.parseLong(resourceId), user.getRoleType());

        authorizationRules.forEach(rule -> {
            AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
                .accountId(requestInfo.getAuthorityInfo().getAccountId())
                .competentAuthority(requestInfo.getAuthorityInfo().getCompetentAuthority())
                .verificationBodyId(requestInfo.getAuthorityInfo().getVerificationBodyId())
                .build();
            appAuthorizationService.authorize(user, authorizationCriteria);
        });
    }
}
