package uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes;

import jakarta.validation.Valid;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumptionPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategoriesPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlternativeComplianceRoutes implements NocP3Section {

	@Valid
	private TotalEnergyConsumptionReduction totalEnergyConsumptionReduction;

	@Valid
	private EnergyConsumptionPotentialReduction energyConsumptionReduction;

	@Valid
	private EnergySavingsCategoriesPotentialReduction energyConsumptionReductionCategories;

	@Valid
	private Assets assets;

	@Valid
	private CertificateDetails iso50001CertificateDetails;

	@Valid
	private CertificatesDetails decCertificatesDetails;

	@Valid
	private CertificatesDetails gdaCertificatesDetails;
}
