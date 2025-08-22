package uk.gov.esos.api.authorization.rules.services.handlers;

import java.util.List;
import java.util.Set;

import lombok.RequiredArgsConstructor;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.esos.api.authorization.rules.services.AuthorizationResourceRuleHandler;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.AccountNoteAuthorityInfoDTO;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.providers.AccountNoteAuthorityInfoProvider;
import uk.gov.esos.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.esos.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;


@Service("accountNoteAccessHandler")
@RequiredArgsConstructor
public class AccountNoteAccessRuleHandler implements AuthorizationResourceRuleHandler {
    
    private final AppAuthorizationService appAuthorizationService;
    private final AccountNoteAuthorityInfoProvider accountNoteAuthorityInfoProvider;
    
    @Override
    public void evaluateRules(final Set<AuthorizationRuleScopePermission> authorizationRules, 
                              final AppUser user,
                              final String resourceId) {

        final AccountNoteAuthorityInfoDTO accountNoteAuthorityInfo = accountNoteAuthorityInfoProvider
                .getAccountNoteAuthorityInfo(Long.parseLong(resourceId));

        List<AuthorizationRuleScopePermission> filteredRules = authorizationRules.stream()
                .filter(rule -> ObjectUtils.isEmpty(rule.getResourceSubType())
                        || accountNoteAuthorityInfo.getResourceSubType().equals(rule.getResourceSubType()))
                .toList();

        if (filteredRules.isEmpty()) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        filteredRules.forEach(rule -> {
            AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
                    .accountId(accountNoteAuthorityInfo.getAuthorityInfo().getAccountId())
                    .permission(rule.getPermission())
                    .build();
            appAuthorizationService.authorize(user, authorizationCriteria);
        });
    }

}
