package uk.gov.esos.api.authorization.operator.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.authorization.core.domain.Authority;
import uk.gov.esos.api.authorization.core.repository.AuthorityRepository;
import uk.gov.esos.api.authorization.operator.event.OperatorAuthorityDeletionEvent;
import uk.gov.esos.api.common.exception.BusinessException;

import java.util.List;

import static uk.gov.esos.api.common.exception.ErrorCode.AUTHORITY_USER_NOT_RELATED_TO_ACCOUNT;

@Service
@RequiredArgsConstructor
public class OperatorAuthorityDeletionService {

    private final AuthorityRepository authorityRepository;
    private final List<OperatorAuthorityDeleteValidator> operatorAuthorityDeleteValidators;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void deleteAccountOperatorAuthority(String userId, Long accountId) {
        List<Authority> authorities = authorityRepository.findByUserId(userId);
        Authority authority = authorities.stream().filter(auth -> accountId.equals(auth.getAccountId()))
            .findFirst().orElseThrow(() -> new BusinessException(AUTHORITY_USER_NOT_RELATED_TO_ACCOUNT));

        operatorAuthorityDeleteValidators.forEach(v -> v.validateDeletion(authority));
        authorityRepository.delete(authority);
        eventPublisher.publishEvent(OperatorAuthorityDeletionEvent.builder()
                .userId(userId)
                .accountId(accountId)
                .build());
    }
}
