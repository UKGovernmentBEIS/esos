package uk.gov.esos.api.account.organisation.onboarding.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.organisation.onboarding.domain.OrganisationAccountOnboardingRegistry;

import java.util.List;

import java.util.Optional;

/**
 * Data repository for the organisation account onboarding registry.
 */
public interface OrganisationAccountOnboardingRegistryRepository 
	extends JpaRepository<OrganisationAccountOnboardingRegistry, Long>{

	@Transactional(readOnly = true)
	Optional<OrganisationAccountOnboardingRegistry> findByEmail(String email);

	@Transactional(readOnly = true)
	Optional<OrganisationAccountOnboardingRegistry> findByEmailAndRegistrationNumber(String email, String registrationNumber);
	
	@Transactional(readOnly = true)
    boolean existsByEmailAndRegistrationNumber(String email, String registrationNumber);

	@Transactional(readOnly = true)
    List<OrganisationAccountOnboardingRegistry> findAllByEmailIn(List<String> emails);

	@Transactional(readOnly = true)
    List<OrganisationAccountOnboardingRegistry> findAllByRegistrationNumberIn(List<String> regNumbers);
}
