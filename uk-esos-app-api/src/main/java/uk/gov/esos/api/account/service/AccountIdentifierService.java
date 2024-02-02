package uk.gov.esos.api.account.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uk.gov.esos.api.account.domain.AccountIdentifier;
import uk.gov.esos.api.account.repository.AccountIdentifierRepository;
import uk.gov.esos.api.common.exception.BusinessException;

import static uk.gov.esos.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class AccountIdentifierService {

    private final AccountIdentifierRepository accountIdentifierRepository;

    @Transactional
    public Long incrementAndGet() {
        AccountIdentifier identifier = accountIdentifierRepository.findAccountIdentifier()
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));

        // Increment identifier
        identifier.setAccountId(identifier.getAccountId() + 1);

        return identifier.getAccountId();
    }
}
