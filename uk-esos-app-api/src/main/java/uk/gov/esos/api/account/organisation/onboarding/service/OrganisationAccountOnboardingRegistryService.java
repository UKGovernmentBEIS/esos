package uk.gov.esos.api.account.organisation.onboarding.service;

import lombok.RequiredArgsConstructor;

import org.apache.commons.collections4.ListUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uk.gov.esos.api.account.organisation.onboarding.config.property.EmailBatchProperties;
import uk.gov.esos.api.account.organisation.onboarding.domain.OnboardingRegistryStatus;
import uk.gov.esos.api.account.organisation.onboarding.domain.OrganisationAccountOnboardingRegistry;
import uk.gov.esos.api.account.organisation.onboarding.domain.OrganisationAccountOnboardingRegistryDTO;
import uk.gov.esos.api.account.organisation.onboarding.repository.OrganisationAccountOnboardingRegistryRepository;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.user.core.service.UserNotificationService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class OrganisationAccountOnboardingRegistryService {
	
	private final OrganisationAccountOnboardingRegistryQueryService queryService;
	private final UserNotificationService userNotificationService;
	private final OrganisationAccountOnboardingRegistryRepository repository;
	private final EmailBatchProperties emailBatchProperties;

	@Transactional
	public void markAccountOnboardingRegistryAsOnboarded(String email, String registrationNumber) {
		OrganisationAccountOnboardingRegistry onboardingRegistry = repository
			.findByEmailAndRegistrationNumber(email, registrationNumber)
			.orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

		onboardingRegistry.setStatus(OnboardingRegistryStatus.ONBOARDED);

		repository.save(onboardingRegistry);
	}
	
	@Transactional
	public void addOrganisationAccountOnboardingRegistries(List<OrganisationAccountOnboardingRegistryDTO> verifiedAccounts, AppUser user) {
		List<String> emails = verifiedAccounts.stream().map(OrganisationAccountOnboardingRegistryDTO::getEmail).toList();
		List<String> regNumbers = verifiedAccounts.stream().map(OrganisationAccountOnboardingRegistryDTO::getRegistrationNumber).toList();

		// Validate duplicate values in the provided list
		validateDuplicateEmailOrRegistrationNumber(emails, regNumbers);
		// Validate existing values in the DB
		validateEmailOrRegistrationNumberExist(emails, regNumbers);
		
		List<OrganisationAccountOnboardingRegistry> onboardingRegistryEntries = buildOnboardingRegistryEntries(verifiedAccounts, user);
		repository.saveAll(onboardingRegistryEntries);

		sendEmailsInBatchesAsync(emails);
	}

	private void sendEmailsInBatchesAsync(List<String> emails) {
		// Partitioning emails based on batch size
		List<List<String>> partitions = ListUtils.partition(emails, emailBatchProperties.getSize());
		List<CompletableFuture<Boolean>> futureList = new ArrayList<>();

		// Supply Completable
		for(int i=0; i<partitions.size(); i++) {
			int index = i;
			long nextInterval = (index * emailBatchProperties.getDelay()) + 2;
			futureList.add(CompletableFuture.supplyAsync(() ->
					sendEmailBatch(partitions.get(index)), CompletableFuture.delayedExecutor(nextInterval, TimeUnit.MILLISECONDS)));
		}

		CompletableFuture<Boolean>[] futures = new CompletableFuture[futureList.size()];
		futureList.toArray(futures);

		// Run asynchronously
		CompletableFuture.allOf(futures).thenRunAsync(() -> {
			for (CompletableFuture<Boolean> future : futures) {
				future.join();
			}
		});
	}

	private boolean sendEmailBatch(List<String> emailsInBatch) {
		emailsInBatch.forEach(userNotificationService::notifyVerifiedAccountUser);
		return true;
	}
	
	private List<OrganisationAccountOnboardingRegistry> buildOnboardingRegistryEntries(
			List<OrganisationAccountOnboardingRegistryDTO> verifiedAccounts, AppUser user) {
		LocalDateTime currentDate = LocalDateTime.now();
		return verifiedAccounts.stream().map(va -> OrganisationAccountOnboardingRegistry.builder()
				.email(va.getEmail().toLowerCase())
				.registrationNumber(va.getRegistrationNumber())
				.status(OnboardingRegistryStatus.PENDING)
				.submitterId(user.getUserId())
				.submissionDate(currentDate)
				.competentAuthority(user.getCompetentAuthority())
				.build())
				.toList();
	}

	private void validateDuplicateEmailOrRegistrationNumber(List<String> emails, List<String> regNumbers) {
		List<String> duplicateEmails = emails.stream()
				.collect(Collectors.groupingBy(email -> email, Collectors.counting()))
				.entrySet().stream().filter(v -> v.getValue() > 1)
				.map(Map.Entry::getKey)
				.toList();
		List<String> duplicateRegNumbers = regNumbers.stream()
				.collect(Collectors.groupingBy(regNo -> regNo, Collectors.counting()))
				.entrySet().stream().filter(v -> v.getValue() > 1)
				.map(Map.Entry::getKey)
				.toList();
		
		if (!duplicateEmails.isEmpty() || !duplicateRegNumbers.isEmpty()) {
			throw new BusinessException(ErrorCode.DUPLICATE_VALUES_EXIST, 
					Stream.concat(duplicateEmails.stream(), duplicateRegNumbers.stream()).toList());
		}
	}

	private void validateEmailOrRegistrationNumberExist(List<String> emails, List<String> regNumbers) {
		List<String> existingEmails = queryService.getExistingEmails(emails);
		List<String> existingRegNumbers = queryService.getExistingRegistrationNumbers(regNumbers);
		
		if (!existingEmails.isEmpty() || !existingRegNumbers.isEmpty()) {
			throw new BusinessException(ErrorCode.VALUES_ALREADY_EXIST, 
					Stream.concat(existingEmails.stream(), existingRegNumbers.stream()).toList());
		}
	}
}
