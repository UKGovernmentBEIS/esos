package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.OptionalQuestion;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute.ComplianceRoute;
import uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute.EnergyAudit;
import uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute.EnergyConsumptionProfiling;
import uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute.EstimatedCalculationType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ComplianceRouteDistribution;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationEnergyResponsibilityType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationQualificationReasonType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationQualificationType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligationDetails;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3ComplianceRouteContextValidatorServiceTest {

	@InjectMocks
    private NocP3ComplianceRouteContextValidatorService contextValidator;

    @Mock
    private NocSectionConstraintValidatorService<ComplianceRoute> nocSectionConstraintValidatorService;

    @Test
    void validate_LESS_THAN_40000_KWH_PER_YEAR_no_energy_audit_valid() {
        final ComplianceRoute complianceRoute = ComplianceRoute.builder()
        		.estimatedCalculationTypes(Set.of(
                		EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION, 
                		EstimatedCalculationType.CONVERSION_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION))
        	.areEstimationMethodsRecorded(OptionalQuestion.SKIP_QUESTION)
            .partsProhibitedFromDisclosingExist(Boolean.TRUE)
            .partsProhibitedFromDisclosing("test")
            .partsProhibitedFromDisclosingReason("test2")
            .build();
        final ReportingObligation reportingObligation = buildReportingObligation();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(reportingObligation)
                		.complianceRoute(complianceRoute)
                		.build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;

        when(nocSectionConstraintValidatorService.validate(complianceRoute)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(complianceRoute);
    }

	@Test
    void validate_LESS_THAN_40000_KWH_PER_YEAR_no_energy_audit_twelveMonthsVerifiableDataUsed_exists_not_valid() {
        final ComplianceRoute complianceRoute = ComplianceRoute.builder()
        	.estimatedCalculationTypes(Set.of(EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION))
        	.areTwelveMonthsVerifiableDataUsed(Boolean.FALSE)
            .twelveMonthsVerifiableDataUsedReason("reason")
            .partsProhibitedFromDisclosingExist(Boolean.TRUE)
            .partsProhibitedFromDisclosing("test")
            .partsProhibitedFromDisclosingReason("test2")
            .build();
        final ReportingObligation reportingObligation = buildReportingObligation();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(reportingObligation)
                		.complianceRoute(complianceRoute)
                		.build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;

        when(nocSectionConstraintValidatorService.validate(complianceRoute)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_DATA.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(complianceRoute);
    }
    
    @Test
    void validate_LESS_THAN_40000_KWH_PER_YEAR_no_energy_audit_energy_audits_exist_not_valid() {
        final ComplianceRoute complianceRoute = ComplianceRoute.builder()
        	.estimatedCalculationTypes(Set.of(EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION))
            .energyAudits(buildEnergyAudit())
            .partsProhibitedFromDisclosingExist(Boolean.TRUE)
            .partsProhibitedFromDisclosing("test")
            .partsProhibitedFromDisclosingReason("test2")
            .build();
        final ReportingObligation reportingObligation = buildReportingObligation();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(reportingObligation)
                		.complianceRoute(complianceRoute)
                		.build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;

        when(nocSectionConstraintValidatorService.validate(complianceRoute)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_DATA.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(complianceRoute);
    }

    void validate_LESS_THAN_40000_KWH_PER_YEAR_no_energy_audit_Energy_Consumption_Profiling_Not_Used_Recorded_exist_not_valid() {
        final ComplianceRoute complianceRoute = ComplianceRoute.builder()
        		.estimatedCalculationTypes(Set.of(EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION))
                .isEnergyConsumptionProfilingNotUsedRecorded(OptionalQuestion.YES)
                .partsProhibitedFromDisclosingExist(Boolean.TRUE)
                .partsProhibitedFromDisclosing("test")
                .partsProhibitedFromDisclosingReason("test2")
                .build();
        final ReportingObligation reportingObligation = buildReportingObligation();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(reportingObligation)
                		.complianceRoute(complianceRoute)
                		.build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;

        when(nocSectionConstraintValidatorService.validate(complianceRoute)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_DATA.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(complianceRoute);
    }
    
    @Test
    void validate_LESS_THAN_40000_KWH_PER_YEAR_has_energy_audit_valid() {
        final ComplianceRoute complianceRoute = ComplianceRoute.builder()
        	.estimatedCalculationTypes(Set.of(EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION))
        	.areTwelveMonthsVerifiableDataUsed(Boolean.TRUE)
        	.areEstimationMethodsRecorded(OptionalQuestion.YES)
            .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.YES)
            .areEnergyConsumptionProfilingMethodsRecorded(OptionalQuestion.YES)
            .energyAudits(buildEnergyAudit())
            .partsProhibitedFromDisclosingExist(Boolean.TRUE)
            .partsProhibitedFromDisclosing("test")
            .partsProhibitedFromDisclosingReason("test2")
            .build();
        ReportingObligation reportingObligation = buildReportingObligation();
        reportingObligation.getReportingObligationDetails().getComplianceRouteDistribution().setEnergyAuditsPct(1);
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(reportingObligation)
                		.complianceRoute(complianceRoute)
                		.build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;

        when(nocSectionConstraintValidatorService.validate(complianceRoute)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(complianceRoute);
    }

    @Test
    void validate_LESS_THAN_40000_KWH_PER_YEAR_has_energy_audit_twelveMonthsVerifiableDataUsed_not_exists_not_valid() {
        final ComplianceRoute complianceRoute = ComplianceRoute.builder()
        	.estimatedCalculationTypes(Set.of(EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION))
            .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.NO)
            .energyAudits(buildEnergyAudit())
            .partsProhibitedFromDisclosingExist(Boolean.TRUE)
            .partsProhibitedFromDisclosing("test")
            .partsProhibitedFromDisclosingReason("test2")
            .build();
        ReportingObligation reportingObligation = buildReportingObligation();
        reportingObligation.getReportingObligationDetails().getComplianceRouteDistribution().setEnergyAuditsPct(1);
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(reportingObligation)
                		.complianceRoute(complianceRoute)
                		.build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;

        when(nocSectionConstraintValidatorService.validate(complianceRoute)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_DATA.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(complianceRoute);
    }
    
    @Test
    void validate_LESS_THAN_40000_KWH_PER_YEAR_has_energy_audit_no_energy_audit_list_not_valid() {
    	final ComplianceRoute complianceRoute = ComplianceRoute.builder()
            	.estimatedCalculationTypes(Set.of(EstimatedCalculationType.AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION))
            	.areTwelveMonthsVerifiableDataUsed(Boolean.TRUE)
            	.areEstimationMethodsRecorded(OptionalQuestion.YES)
                .energyConsumptionProfilingUsed(EnergyConsumptionProfiling.YES)
                .areEnergyConsumptionProfilingMethodsRecorded(OptionalQuestion.YES)
                .partsProhibitedFromDisclosingExist(Boolean.FALSE)
                .build();
        ReportingObligation reportingObligation = buildReportingObligation();
        reportingObligation.getReportingObligationDetails().getComplianceRouteDistribution().setEnergyAuditsPct(1);
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                		.reportingObligation(reportingObligation)
                		.complianceRoute(complianceRoute)
                		.build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;

        when(nocSectionConstraintValidatorService.validate(complianceRoute)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_DATA.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(complianceRoute);
    }
    
    @Test
    void getApplicableReportingObligationCategories() {
        assertThat(contextValidator.getApplicableReportingObligationCategories(null)).containsExactlyInAnyOrder(
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
                ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR,
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
        );
    }
    
    private ReportingObligation buildReportingObligation() {
		return  ReportingObligation.builder()
	            .qualificationType(OrganisationQualificationType.QUALIFY)
	            .reportingObligationDetails(ReportingObligationDetails.builder()
	                .qualificationReasonType(OrganisationQualificationReasonType.STAFF_MEMBERS_MORE_THAN_250)
	                .energyResponsibilityType(OrganisationEnergyResponsibilityType.RESPONSIBLE_BUT_LESS_THAN_40000_KWH)
	                .complianceRouteDistribution(ComplianceRouteDistribution.builder()
	                    .iso50001Pct(90)
	                    .greenDealAssessmentPct(5)
	                    .displayEnergyCertificatePct(0)
	                    .energyAuditsPct(0)
	                    .energyNotAuditedPct(5)
	                    .totalPct(100)
	                    .build())
	                .build())
	            .build();
	}
    
    private List<EnergyAudit> buildEnergyAudit() {
		return List.of(EnergyAudit.builder()
				.description("desc")
				.numberOfSitesCovered(1)
				.numberOfSitesVisited(2)
				.reason("reason")
				.build());
	}
}
