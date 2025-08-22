package uk.gov.esos.api.account.organisation.onboarding.domain;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganisationAccountOnboardingRegistryDTO {

	@NotBlank
	@Email
	private String email;
	
	@NotBlank
	private String registrationNumber;
}
