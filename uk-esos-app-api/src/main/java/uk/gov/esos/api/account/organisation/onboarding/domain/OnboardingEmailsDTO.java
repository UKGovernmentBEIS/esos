package uk.gov.esos.api.account.organisation.onboarding.domain;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingEmailsDTO {

	@NotEmpty
	private List<String> emails;
}
