package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumptionPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategoriesPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.PotentialReductionPair;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes.AlternativeComplianceRoutes;
import uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes.Assets;
import uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes.CertificateDetails;
import uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes.CertificatesDetails;
import uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes.TotalEnergyConsumptionReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ComplianceRouteDistribution;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligationDetails;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3AlternativeComplianceRoutesContextValidatorServiceTest {

	@InjectMocks
    private NocP3AlternativeComplianceRoutesContextValidatorService contextValidator;

	@Mock
	private NocSectionConstraintValidatorService<AlternativeComplianceRoutes> nocSectionConstraintValidatorService;

	@Mock
	private PotentialReductionEnergyCostValidator potentialReductionEnergyCostValidator;

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_valid() {
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.totalEnergyConsumptionReduction(TotalEnergyConsumptionReduction.builder()
				.potentialReductionPair(PotentialReductionPair.builder()
					.energyConsumption(10000L)
					.build())
				.build())
			.assets(Assets.builder()
				.iso50001("iso50001 text")
				.build())
			.iso50001CertificateDetails(CertificateDetails.builder()
				.certificateNumber("cert number")
				.validFrom(LocalDate.now().minusDays(1))
				.validUntil(LocalDate.now().plusDays(1))
				.build())
			.build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .alternativeComplianceRoutes(alternativeComplianceRoutes)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
		verifyNoInteractions(potentialReductionEnergyCostValidator);
    }

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_totalEnergyConsumptionReduction_not_exists_invalid() {
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.assets(Assets.builder()
				.iso50001("iso50001 text")
				.build())
			.iso50001CertificateDetails(CertificateDetails.builder()
				.certificateNumber("cert number")
				.validFrom(LocalDate.now().minusDays(1))
				.validUntil(LocalDate.now().plusDays(1))
				.build())
			.build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.alternativeComplianceRoutes(alternativeComplianceRoutes)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
		verifyNoInteractions(potentialReductionEnergyCostValidator);
    }

	@Test
	void validate_ISO_50001_COVERING_ENERGY_USAGE_energyConsumptionReduction_not_exists_invalid() {

		final EnergyConsumptionPotentialReduction potentialReduction =
				EnergyConsumptionPotentialReduction.builder()
						.buildings(PotentialReductionPair.builder().energyConsumption(10L).build())
						.transport(PotentialReductionPair.builder().energyConsumption(10L).build())
						.industrialProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.otherProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.energyConsumptionTotal(40L)
						.energyCostTotal(BigDecimal.ZERO)
						.build();
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
				.energyConsumptionReduction(potentialReduction)
				.assets(Assets.builder()
						.iso50001("iso50001 text")
						.build())
				.iso50001CertificateDetails(CertificateDetails.builder()
						.certificateNumber("cert number")
						.validFrom(LocalDate.now().minusDays(1))
						.validUntil(LocalDate.now().plusDays(1))
						.build())
				.build();
		final NocP3Container nocP3Container = NocP3Container.builder()
				.noc(NocP3.builder()
						.alternativeComplianceRoutes(alternativeComplianceRoutes)
						.build())
				.build();
		final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());

		// Invoke
		NocValidationResult result = contextValidator.validate(nocP3Container, category);

		// Verify
		assertThat(result.isValid()).isFalse();
		assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
				.containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_REDUCTION.getMessage());

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
		verifyNoInteractions(potentialReductionEnergyCostValidator);
	}
    
    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_gda_dec_exist_iso50001_not_exist_invalid() {
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.totalEnergyConsumptionReduction(TotalEnergyConsumptionReduction.builder()
				.potentialReductionPair(PotentialReductionPair.builder()
					.energyConsumption(10000L)
					.build())
				.build())
			.assets(Assets.builder()
				.dec("dec text")
				.iso50001("aa")
				.build())
			.decCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.gdaCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.alternativeComplianceRoutes(alternativeComplianceRoutes)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage).containsExactlyInAnyOrder(
        		NocViolation.NocViolationMessage.INVALID_ISO50001_DETAILS.getMessage(),
        		NocViolation.NocViolationMessage.INVALID_DEC_DETAILS.getMessage(),
        		NocViolation.NocViolationMessage.INVALID_GDA_DETAILS.getMessage());

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
		verifyNoInteractions(potentialReductionEnergyCostValidator);
    }
    
   	@Test
    void validate_PARTIAL_ENERGY_ASSESSMENTS_valid() {
		final EnergyConsumptionPotentialReduction potentialReduction =
				EnergyConsumptionPotentialReduction.builder()
						.buildings(PotentialReductionPair.builder().energyConsumption(10L).build())
						.transport(PotentialReductionPair.builder().energyConsumption(10L).build())
						.industrialProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.otherProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.energyConsumptionTotal(40L)
						.energyCostTotal(BigDecimal.ZERO)
						.build();
		final EnergySavingsCategoriesPotentialReduction savingsCategoriesPotentialReduction =
				EnergySavingsCategoriesPotentialReduction.builder()
						.energyManagementPractices(PotentialReductionPair.builder().energyConsumption(10L).build())
						.behaviourChangeInterventions(PotentialReductionPair.builder().energyConsumption(0L).build())
						.controlsImprovements(PotentialReductionPair.builder().energyConsumption(10L).build())
						.capitalInvestments(PotentialReductionPair.builder().energyConsumption(0L).build())
						.training(PotentialReductionPair.builder().energyConsumption(10L).build())
						.otherMeasures(PotentialReductionPair.builder().energyConsumption(0L).build())
						.energyConsumptionTotal(40L)
						.energyCostTotal(BigDecimal.ZERO)
						.build();
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.totalEnergyConsumptionReduction(TotalEnergyConsumptionReduction.builder()
					.potentialReductionPair(PotentialReductionPair.builder()
							.energyConsumption(10L)
							.energyCost(BigDecimal.TEN)
							.build())
					.build())
			.energyConsumptionReduction(potentialReduction)
			.energyConsumptionReductionCategories(savingsCategoriesPotentialReduction)
			.assets(Assets.builder()
				.dec("dec text")
				.build())
			.decCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(ReportingObligation.builder()
                				.reportingObligationDetails(ReportingObligationDetails.builder()
                						.complianceRouteDistribution(ComplianceRouteDistribution.builder()
                								.iso50001Pct(0)
                								.displayEnergyCertificatePct(1)
                								.greenDealAssessmentPct(0)
                								.build())
                						.build())
                				.build())
                		.alternativeComplianceRoutes(alternativeComplianceRoutes)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());
		when(potentialReductionEnergyCostValidator.isEnergyConsumptionValid(potentialReduction)).thenReturn(true);
		when(potentialReductionEnergyCostValidator.isEnergySavingsCategoriesValid(savingsCategoriesPotentialReduction)).thenReturn(true);

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergyConsumptionValid(potentialReduction);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergySavingsCategoriesValid(savingsCategoriesPotentialReduction);
    }
   	
   	@Test
    void validate_PARTIAL_ENERGY_ASSESSMENTS_potential_reduction_not_exists_valid() {
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.energyConsumptionReduction(null)
			.energyConsumptionReductionCategories(null)
			.assets(Assets.builder()
				.dec("dec text")
				.build())
			.decCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(ReportingObligation.builder()
                				.reportingObligationDetails(ReportingObligationDetails.builder()
                						.complianceRouteDistribution(ComplianceRouteDistribution.builder()
                								.iso50001Pct(0)
                								.displayEnergyCertificatePct(1)
                								.greenDealAssessmentPct(0)
                								.build())
                						.build())
                				.build())
                		.alternativeComplianceRoutes(alternativeComplianceRoutes)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());
		when(potentialReductionEnergyCostValidator.isEnergyConsumptionValid(null)).thenReturn(true);
		when(potentialReductionEnergyCostValidator.isEnergySavingsCategoriesValid(null)).thenReturn(true);
		
        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergyConsumptionValid(null);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergySavingsCategoriesValid(null);
    }

    @Test
    void validate_PARTIAL_ENERGY_ASSESSMENTS_totalEnergyConsumptionReduction_exists_invalid() {
		final EnergyConsumptionPotentialReduction potentialReduction =
				EnergyConsumptionPotentialReduction.builder()
						.buildings(PotentialReductionPair.builder().energyConsumption(10L).build())
						.transport(PotentialReductionPair.builder().energyConsumption(10L).build())
						.industrialProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.otherProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.energyConsumptionTotal(40L)
						.energyCostTotal(BigDecimal.ZERO)
						.build();
		final EnergySavingsCategoriesPotentialReduction savingsCategoriesPotentialReduction =
				EnergySavingsCategoriesPotentialReduction.builder()
						.energyManagementPractices(PotentialReductionPair.builder().energyConsumption(10L).build())
						.behaviourChangeInterventions(PotentialReductionPair.builder().energyConsumption(0L).build())
						.controlsImprovements(PotentialReductionPair.builder().energyConsumption(10L).build())
						.capitalInvestments(PotentialReductionPair.builder().energyConsumption(0L).build())
						.training(PotentialReductionPair.builder().energyConsumption(10L).build())
						.otherMeasures(PotentialReductionPair.builder().energyConsumption(0L).build())
						.energyConsumptionTotal(40L)
						.energyCostTotal(BigDecimal.ZERO)
						.build();
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.energyConsumptionReduction(potentialReduction)
			.energyConsumptionReductionCategories(savingsCategoriesPotentialReduction)
			.totalEnergyConsumptionReduction(TotalEnergyConsumptionReduction.builder()
				.potentialReductionPair(PotentialReductionPair.builder()
					.energyConsumption(10000L)
					.build())
				.build())
			.assets(Assets.builder()
				.dec("dec text")
				.build())
			.decCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(ReportingObligation.builder()
                				.reportingObligationDetails(ReportingObligationDetails.builder()
                						.complianceRouteDistribution(ComplianceRouteDistribution.builder()
                								.iso50001Pct(0)
                								.displayEnergyCertificatePct(1)
                								.greenDealAssessmentPct(0)
                								.build())
                						.build())
                				.build())
                		.alternativeComplianceRoutes(alternativeComplianceRoutes)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());
		when(potentialReductionEnergyCostValidator.isEnergyConsumptionValid(potentialReduction)).thenReturn(true);
		when(potentialReductionEnergyCostValidator.isEnergySavingsCategoriesValid(savingsCategoriesPotentialReduction)).thenReturn(true);

		// Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();
        assertThat(result.getNocViolations()).isEmpty();

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergyConsumptionValid(potentialReduction);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergySavingsCategoriesValid(savingsCategoriesPotentialReduction);
    }

	@Test
	void validate_PARTIAL_ENERGY_ASSESSMENTS_energy_consumption_energyCostTotal_invalid() {
		final EnergyConsumptionPotentialReduction potentialReduction =
				EnergyConsumptionPotentialReduction.builder()
						.buildings(PotentialReductionPair.builder().energyConsumption(10L).build())
						.transport(PotentialReductionPair.builder().energyConsumption(10L).build())
						.industrialProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.otherProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.energyConsumptionTotal(40L)
						.energyCostTotal(BigDecimal.ZERO)
						.build();
		final EnergySavingsCategoriesPotentialReduction savingsCategoriesPotentialReduction =
				EnergySavingsCategoriesPotentialReduction.builder()
						.energyManagementPractices(PotentialReductionPair.builder().energyConsumption(10L).build())
						.behaviourChangeInterventions(PotentialReductionPair.builder().energyConsumption(0L).build())
						.controlsImprovements(PotentialReductionPair.builder().energyConsumption(10L).build())
						.capitalInvestments(PotentialReductionPair.builder().energyConsumption(0L).build())
						.training(PotentialReductionPair.builder().energyConsumption(10L).build())
						.otherMeasures(PotentialReductionPair.builder().energyConsumption(0L).build())
						.energyConsumptionTotal(40L)
						.energyCostTotal(BigDecimal.ZERO)
						.build();
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
				.energyConsumptionReduction(potentialReduction)
				.energyConsumptionReductionCategories(savingsCategoriesPotentialReduction)
				.assets(Assets.builder()
						.dec("dec text")
						.build())
				.decCertificatesDetails(CertificatesDetails.builder()
						.certificateDetails(List.of(CertificateDetails.builder()
								.certificateNumber("cert number")
								.validFrom(LocalDate.now().minusDays(1))
								.validUntil(LocalDate.now().plusDays(1))
								.build()))
						.build())
				.build();
		final NocP3Container nocP3Container = NocP3Container.builder()
				.noc(NocP3.builder()
						.reportingObligation(ReportingObligation.builder()
								.reportingObligationDetails(ReportingObligationDetails.builder()
										.complianceRouteDistribution(ComplianceRouteDistribution.builder()
												.iso50001Pct(0)
												.displayEnergyCertificatePct(1)
												.greenDealAssessmentPct(0)
												.build())
										.build())
								.build())
						.alternativeComplianceRoutes(alternativeComplianceRoutes)
						.build())
				.build();
		final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());
		when(potentialReductionEnergyCostValidator.isEnergyConsumptionValid(potentialReduction)).thenReturn(false);
		when(potentialReductionEnergyCostValidator.isEnergySavingsCategoriesValid(savingsCategoriesPotentialReduction)).thenReturn(true);

		// Invoke
		NocValidationResult result = contextValidator.validate(nocP3Container, category);

		// Verify
		assertThat(result.isValid()).isFalse();
		assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
				.containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_REDUCTION_COST.getMessage());

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergyConsumptionValid(potentialReduction);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergySavingsCategoriesValid(savingsCategoriesPotentialReduction);
	}

	@Test
	void validate_PARTIAL_ENERGY_ASSESSMENTS_categories_energyCostTotal_invalid() {
		final EnergyConsumptionPotentialReduction potentialReduction =
				EnergyConsumptionPotentialReduction.builder()
						.buildings(PotentialReductionPair.builder().energyConsumption(10L).build())
						.transport(PotentialReductionPair.builder().energyConsumption(10L).build())
						.industrialProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.otherProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.energyConsumptionTotal(40L)
						.energyCostTotal(BigDecimal.ZERO)
						.build();
		final EnergySavingsCategoriesPotentialReduction savingsCategoriesPotentialReduction =
				EnergySavingsCategoriesPotentialReduction.builder()
						.energyManagementPractices(PotentialReductionPair.builder().energyConsumption(10L).build())
						.behaviourChangeInterventions(PotentialReductionPair.builder().energyConsumption(0L).build())
						.controlsImprovements(PotentialReductionPair.builder().energyConsumption(10L).build())
						.capitalInvestments(PotentialReductionPair.builder().energyConsumption(0L).build())
						.training(PotentialReductionPair.builder().energyConsumption(10L).build())
						.otherMeasures(PotentialReductionPair.builder().energyConsumption(0L).build())
						.energyConsumptionTotal(40L)
						.energyCostTotal(BigDecimal.ZERO)
						.build();
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
				.energyConsumptionReduction(potentialReduction)
				.energyConsumptionReductionCategories(savingsCategoriesPotentialReduction)
				.assets(Assets.builder()
						.dec("dec text")
						.build())
				.decCertificatesDetails(CertificatesDetails.builder()
						.certificateDetails(List.of(CertificateDetails.builder()
								.certificateNumber("cert number")
								.validFrom(LocalDate.now().minusDays(1))
								.validUntil(LocalDate.now().plusDays(1))
								.build()))
						.build())
				.build();
		final NocP3Container nocP3Container = NocP3Container.builder()
				.noc(NocP3.builder()
						.reportingObligation(ReportingObligation.builder()
								.reportingObligationDetails(ReportingObligationDetails.builder()
										.complianceRouteDistribution(ComplianceRouteDistribution.builder()
												.iso50001Pct(0)
												.displayEnergyCertificatePct(1)
												.greenDealAssessmentPct(0)
												.build())
										.build())
								.build())
						.alternativeComplianceRoutes(alternativeComplianceRoutes)
						.build())
				.build();
		final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());
		when(potentialReductionEnergyCostValidator.isEnergyConsumptionValid(potentialReduction)).thenReturn(true);
		when(potentialReductionEnergyCostValidator.isEnergySavingsCategoriesValid(savingsCategoriesPotentialReduction)).thenReturn(false);

		// Invoke
		NocValidationResult result = contextValidator.validate(nocP3Container, category);

		// Verify
		assertThat(result.isValid()).isFalse();
		assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
				.containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_CATEGORIES_COST.getMessage());

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergyConsumptionValid(potentialReduction);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergySavingsCategoriesValid(savingsCategoriesPotentialReduction);
	}
    
    @Test
    void validate_PARTIAL_ENERGY_ASSESSMENTS_wrong_certificates_invalid() {
		final EnergyConsumptionPotentialReduction potentialReduction =
				EnergyConsumptionPotentialReduction.builder()
						.buildings(PotentialReductionPair.builder().energyConsumption(10L).build())
						.transport(PotentialReductionPair.builder().energyConsumption(10L).build())
						.industrialProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.otherProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.energyConsumptionTotal(40L)
						.energyCostTotal(BigDecimal.ZERO)
						.build();
		final EnergySavingsCategoriesPotentialReduction savingsCategoriesPotentialReduction =
				EnergySavingsCategoriesPotentialReduction.builder()
						.energyManagementPractices(PotentialReductionPair.builder().energyConsumption(10L).build())
						.behaviourChangeInterventions(PotentialReductionPair.builder().energyConsumption(0L).build())
						.controlsImprovements(PotentialReductionPair.builder().energyConsumption(10L).build())
						.capitalInvestments(PotentialReductionPair.builder().energyConsumption(0L).build())
						.training(PotentialReductionPair.builder().energyConsumption(10L).build())
						.otherMeasures(PotentialReductionPair.builder().energyConsumption(0L).build())
						.energyConsumptionTotal(40L)
						.energyCostTotal(BigDecimal.ZERO)
						.build();
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.energyConsumptionReduction(potentialReduction)
			.energyConsumptionReductionCategories(savingsCategoriesPotentialReduction)
			.assets(Assets.builder()
				.iso50001("iso50001 text")
				.build())
			.decCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.gdaCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(ReportingObligation.builder()
                				.reportingObligationDetails(ReportingObligationDetails.builder()
                						.complianceRouteDistribution(ComplianceRouteDistribution.builder()
                								.iso50001Pct(5)
                								.displayEnergyCertificatePct(0)
                								.greenDealAssessmentPct(5)
                								.build())
                						.build())
                				.build())
                		.alternativeComplianceRoutes(alternativeComplianceRoutes)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());
		when(potentialReductionEnergyCostValidator.isEnergyConsumptionValid(potentialReduction)).thenReturn(true);
		when(potentialReductionEnergyCostValidator.isEnergySavingsCategoriesValid(savingsCategoriesPotentialReduction)).thenReturn(true);

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage).containsExactlyInAnyOrder(
        		NocViolation.NocViolationMessage.INVALID_ISO50001_DETAILS.getMessage(),
        		NocViolation.NocViolationMessage.INVALID_DEC_DETAILS.getMessage(),
        		NocViolation.NocViolationMessage.INVALID_GDA_DETAILS.getMessage());

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergyConsumptionValid(potentialReduction);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergySavingsCategoriesValid(savingsCategoriesPotentialReduction);
    }

	@Test
	void validate_PARTIAL_ENERGY_ASSESSMENTS_invalid_reporting_obligation_data() {
		final EnergyConsumptionPotentialReduction potentialReduction =
				EnergyConsumptionPotentialReduction.builder()
						.buildings(PotentialReductionPair.builder().energyConsumption(10L).build())
						.transport(PotentialReductionPair.builder().energyConsumption(10L).build())
						.industrialProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.otherProcesses(PotentialReductionPair.builder().energyConsumption(10L).build())
						.energyConsumptionTotal(40L)
						.energyCostTotal(BigDecimal.ZERO)
						.build();
		final EnergySavingsCategoriesPotentialReduction savingsCategoriesPotentialReduction =
				EnergySavingsCategoriesPotentialReduction.builder()
						.energyManagementPractices(PotentialReductionPair.builder().energyConsumption(10L).build())
						.behaviourChangeInterventions(PotentialReductionPair.builder().energyConsumption(0L).build())
						.controlsImprovements(PotentialReductionPair.builder().energyConsumption(10L).build())
						.capitalInvestments(PotentialReductionPair.builder().energyConsumption(0L).build())
						.training(PotentialReductionPair.builder().energyConsumption(10L).build())
						.otherMeasures(PotentialReductionPair.builder().energyConsumption(0L).build())
						.energyConsumptionTotal(40L)
						.energyCostTotal(BigDecimal.ZERO)
						.build();
		final AlternativeComplianceRoutes alternativeComplianceRoutes = AlternativeComplianceRoutes.builder()
			.energyConsumptionReduction(potentialReduction)
			.energyConsumptionReductionCategories(savingsCategoriesPotentialReduction)
			.assets(Assets.builder()
				.dec("dec text")
				.build())
			.decCertificatesDetails(CertificatesDetails.builder()
				.certificateDetails(List.of(CertificateDetails.builder()
					.certificateNumber("cert number")
					.validFrom(LocalDate.now().minusDays(1))
					.validUntil(LocalDate.now().plusDays(1))
					.build()))
				.build())
			.build();
		final NocP3Container nocP3Container = NocP3Container.builder()
			.noc(NocP3.builder()
				.reportingObligation(ReportingObligation.builder().build())
				.alternativeComplianceRoutes(alternativeComplianceRoutes)
				.build())
			.build();
		final ReportingObligationCategory category = ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS;

		when(nocSectionConstraintValidatorService.validate(alternativeComplianceRoutes)).thenReturn(Optional.empty());
		when(potentialReductionEnergyCostValidator.isEnergyConsumptionValid(potentialReduction)).thenReturn(true);
		when(potentialReductionEnergyCostValidator.isEnergySavingsCategoriesValid(savingsCategoriesPotentialReduction)).thenReturn(true);

		// Invoke
		NocValidationResult result = contextValidator.validate(nocP3Container, category);

		// Verify
		assertThat(result.isValid()).isFalse();
		assertThat(result.getNocViolations()).extracting(NocViolation::getMessage).containsOnly(
			NocViolation.NocViolationMessage.INVALID_DEPENDENT_SECTION_DATA.getMessage());

		verify(nocSectionConstraintValidatorService, times(1)).validate(alternativeComplianceRoutes);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergyConsumptionValid(potentialReduction);
		verify(potentialReductionEnergyCostValidator, times(1)).isEnergySavingsCategoriesValid(savingsCategoriesPotentialReduction);
	}
    
    @Test
    void getApplicableReportingObligationCategories_alternative_routes_not_zero() {
    	NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .reportingObligation(ReportingObligation.builder()
                        		.reportingObligationDetails(ReportingObligationDetails.builder()
                                		.complianceRouteDistribution(ComplianceRouteDistribution.builder()
                                				.iso50001Pct(1)
                                				.displayEnergyCertificatePct(0)
                                				.greenDealAssessmentPct(0)
                                				.build())
                                		.build())
                        		.build())
                        .build())
                .build();
    	
        assertThat(contextValidator.getApplicableReportingObligationCategories(nocContainer)).containsExactlyInAnyOrder(
                ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR,
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
        );
		verifyNoInteractions(potentialReductionEnergyCostValidator);
    }
    
    @Test
    void getApplicableReportingObligationCategories_alternative_routes_not_exist_or_zero() {
    	NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .reportingObligation(ReportingObligation.builder()
                        		.reportingObligationDetails(ReportingObligationDetails.builder()
                        				.complianceRouteDistribution(ComplianceRouteDistribution.builder()
                                				.iso50001Pct(0)
                                				.displayEnergyCertificatePct(0)
                                				.greenDealAssessmentPct(0)
                                				.build())
                                		.build())
                        		.build())
                        .build())
                .build();
    	
    	// alternative routes exist but are 0
        assertThat(contextValidator.getApplicableReportingObligationCategories(nocContainer)).containsExactlyInAnyOrder(
                ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
        );
        
        // alternative routes do not exist
        nocContainer.getNoc().getReportingObligation().getReportingObligationDetails()
    		.setComplianceRouteDistribution(null);
        
        assertThat(contextValidator.getApplicableReportingObligationCategories(nocContainer)).containsExactlyInAnyOrder(
                ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
        );
		verifyNoInteractions(potentialReductionEnergyCostValidator);
    }
}
