package uk.gov.esos.api.account.organisation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.client.service.CompanyInformationService;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.organisation.repository.OrganisationAccountRepository;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganisationAccountValidationService {

    private final OrganisationAccountRepository repository;
    private final CompanyInformationService companyInformationService;

    /**
     * Validates whether there is a LIVE organisation account with the provided registration number.
     * Repository method {@link OrganisationAccountRepository#findAllByRegistrationNumber(String)} searches for all records
     * with the provided registration number and locks the returned records to ensure data integrity based on the requirement
     * to have only one LIVE organisation account with the same registration number.
     * Scope of this method is to avoid the concurrent update of two records with the same registration number that could cause invalid data.
     *
     * @param registrationNumber the registration number
     */
    public void validateActiveAccountRegistrationNumberExistenceForUpdate(String registrationNumber) {
        if(registrationNumber != null) {
            validateCompanyExistence(registrationNumber);

            List<OrganisationAccount> accounts = repository.findAllByRegistrationNumber(registrationNumber);
            boolean existsActiveAccount = accounts.stream().anyMatch(acc -> OrganisationAccountStatus.LIVE.equals(acc.getStatus()));

            if(existsActiveAccount) {
                throw new BusinessException(ErrorCode.ACCOUNT_REGISTRATION_NUMBER_ALREADY_EXISTS, registrationNumber);
            }
        }
    }

    public void validateActiveAccountRegistrationNumberExistence(String registrationNumber) {
        validateCompanyExistence(registrationNumber);
        if (isExistingActiveAccountRegistrationNumber(registrationNumber)) {
            throw new BusinessException(ErrorCode.ACCOUNT_REGISTRATION_NUMBER_ALREADY_EXISTS, registrationNumber);
        }
    }

    public boolean isExistingActiveAccountRegistrationNumber(String registrationNumber) {
        return registrationNumber != null && repository.existsByRegistrationNumberAndStatus(registrationNumber, OrganisationAccountStatus.LIVE);
    }

    public void validateCompanyExistence(String registrationNumber) {
        if(registrationNumber != null) {
            companyInformationService.getCompanyProfile(registrationNumber);
        }
    }
}
