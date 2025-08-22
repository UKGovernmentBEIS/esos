package uk.gov.esos.api.account.organisation.onboarding.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import uk.gov.esos.api.account.organisation.onboarding.domain.OrganisationAccountOnboardingRegistry;
import uk.gov.esos.api.account.organisation.onboarding.repository.OrganisationAccountOnboardingRegistryRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrganisationAccountOnboardingRegistryQueryService {

    private final OrganisationAccountOnboardingRegistryRepository repository;

    public Optional<String> getRegistrationNumberByEmail(String email) {
        return repository.findByEmail(email.toLowerCase()).map(OrganisationAccountOnboardingRegistry::getRegistrationNumber);
    }
    
    public boolean existsByEmailAndRegistrationNumber(String email, String registrationNumber) {
        return repository.existsByEmailAndRegistrationNumber(email.toLowerCase(), registrationNumber);
    }

    public List<String> getExistingEmails(List<String> emails) {
        emails = emails.stream().map(String::toLowerCase).toList();
        return repository.findAllByEmailIn(emails).stream()
        		.map(OrganisationAccountOnboardingRegistry::getEmail)
        		.toList();
    }

	public List<String> getExistingRegistrationNumbers(List<String> regNumbers) {
        return repository.findAllByRegistrationNumberIn(regNumbers).stream()
        		.map(OrganisationAccountOnboardingRegistry::getRegistrationNumber)
        		.toList();
	}
}
