package uk.gov.esos.api.account.organisation.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.repository.AccountBaseRepository;

import java.util.List;

@Repository
public interface OrganisationAccountRepository
        extends AccountBaseRepository<OrganisationAccount>,
        OrganisationAccountCustomRepository {

    @Query(nativeQuery = true, value = "SELECT NEXTVAL('account_organisation_seq')")
    Long generateId();

    @Transactional(readOnly = true)
    List<OrganisationAccount> findAllByIdIn(List<Long> ids);

    @Transactional(readOnly = true)
    boolean existsByRegistrationNumberAndStatus(String registrationNumber, OrganisationAccountStatus status);

    @Lock(value = LockModeType.PESSIMISTIC_READ)
    List<OrganisationAccount> findAllByRegistrationNumber(String registrationNumber);
}