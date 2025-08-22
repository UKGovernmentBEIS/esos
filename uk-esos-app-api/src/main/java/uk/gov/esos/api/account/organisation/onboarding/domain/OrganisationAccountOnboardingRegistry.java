package uk.gov.esos.api.account.organisation.onboarding.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@EqualsAndHashCode
@Table(name = "account_organisation_onboarding_registry")
public class OrganisationAccountOnboardingRegistry {

	@Id
	@SequenceGenerator(name = "account_organisation_onboarding_registry_generator", sequenceName = "account_organisation_onboarding_registry_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "account_organisation_onboarding_registry_generator")
	private Long id;

	@Column(name = "email", unique = true)
	@NotBlank
	private String email;

	@Column(name = "registration_number", unique = true)
	@NotBlank
	private String registrationNumber;
	
	@Enumerated(EnumType.STRING)
    @Column(name = "status")
    @NotNull
    private OnboardingRegistryStatus status;
	
	@Column(name = "submitter_id")
    @NotNull
    private String submitterId;
	
	@Column(name = "submission_date")
	@NotNull
	private LocalDateTime submissionDate;
	
	@Enumerated(EnumType.STRING)
    @Column(name = "competent_authority")
    private CompetentAuthorityEnum competentAuthority;
}
