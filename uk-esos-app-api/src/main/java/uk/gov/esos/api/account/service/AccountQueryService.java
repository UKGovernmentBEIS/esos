package uk.gov.esos.api.account.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.domain.Account;
import uk.gov.esos.api.account.domain.dto.AccountInfoDTO;
import uk.gov.esos.api.account.domain.enumeration.AccountStatus;
import uk.gov.esos.api.account.repository.AccountRepository;
import uk.gov.esos.api.account.transform.AccountMapper;
import uk.gov.esos.api.authorization.rules.services.authorityinfo.providers.AccountAuthorityInfoProvider;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static uk.gov.esos.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class AccountQueryService implements AccountAuthorityInfoProvider {

    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;

    @Override
    public CompetentAuthorityEnum getAccountCa(Long accountId) {
        return getAccountById(accountId).getCompetentAuthority();
    }

    public String getAccountName(Long accountId) {
        return getAccountById(accountId).getName();
    }

    public AccountStatus getAccountStatus(Long accountId) {
        return getAccountById(accountId).getStatus();
    }

    public AccountType getAccountType(Long accountId) {
        return getAccountById(accountId).getAccountType();
    }

    public Account exclusiveLockAccount(final Long accountId) {
        return accountRepository.findByIdForUpdate(accountId)
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
    }

    @Override
    public Optional<Long> getAccountVerificationBodyId(Long accountId) {
        return Optional.ofNullable(getAccountById(accountId).getVerificationBodyId());
    }

    public AccountInfoDTO getAccountInfoDTOById(Long accountId) {
        return accountMapper.toAccountInfoDTO(getAccountById(accountId));
    }

    public Set<Long> getAccountIdsByAccountType(List<Long> accountIds, AccountType accountType) {
        return accountRepository.findAllByIdInAndAccountType(accountIds, accountType)
            .stream()
            .map(Account::getId)
            .collect(Collectors.toSet());
    }

    Account getAccountById(Long accountId) {
        return accountRepository.findById(accountId)
            .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
    }
}
