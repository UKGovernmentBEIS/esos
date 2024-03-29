package uk.gov.esos.api.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import uk.gov.esos.api.account.domain.AccountIdentifier;

import jakarta.persistence.LockModeType;
import java.util.Optional;

@Repository
public interface AccountIdentifierRepository extends JpaRepository<AccountIdentifier, Integer> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query(name = AccountIdentifier.NAMED_QUERY_FIND_ACCOUNT_IDENTIFIER)
    Optional<AccountIdentifier> findAccountIdentifier();
}
