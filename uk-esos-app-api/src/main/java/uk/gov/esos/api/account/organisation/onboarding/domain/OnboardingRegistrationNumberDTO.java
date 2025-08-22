package uk.gov.esos.api.account.organisation.onboarding.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingRegistrationNumberDTO {

    private String registrationNumber;
}
