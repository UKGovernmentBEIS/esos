package uk.gov.esos.api.account.organisation.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.ClassificationType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@EqualsAndHashCode
@Table(name = "account_organisation_classification_code")
public class ClassificationCode {

	@Id
	@SequenceGenerator(name = "account_organisation_classification_code_generator", sequenceName = "account_organisation_classification_code_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "account_organisation_classification_code_generator")
	private Long id;

	@NotNull
    @ManyToOne
    @JoinColumn(name = "account_id")
    private OrganisationAccount account;
	
	@Column(name = "type")
	@Enumerated(EnumType.STRING)
	@NotNull
	private ClassificationType type;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "code")
	@NotBlank
	private String code;
}
