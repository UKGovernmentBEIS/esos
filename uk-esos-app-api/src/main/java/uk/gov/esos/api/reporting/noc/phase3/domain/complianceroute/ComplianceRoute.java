package uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;
import uk.gov.esos.api.reporting.noc.phase3.domain.OptionalQuestion;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(!#estimatedCalculationTypes.contains('NONE_OF_THE_ABOVE') || (#estimatedCalculationTypes.size() == 1))}",
	message = "noc.complianceroute.estimatedCalculationTypes")
@SpELExpression(expression = "{T(java.lang.Boolean).FALSE.equals(#areTwelveMonthsVerifiableDataUsed) == (#twelveMonthsVerifiableDataUsedReason != null)}", 
	message = "noc.complianceroute.twelveMonthsVerifiableDataUsedReason")
@SpELExpression(expression = "{(#energyConsumptionProfilingUsed eq 'YES') == (#areEnergyConsumptionProfilingMethodsRecorded != null)}", 
	message = "noc.complianceroute.areEnergyConsumptionProfilingMethodsRecorded")
@SpELExpression(expression = "{(#energyConsumptionProfilingUsed eq 'NO' || #energyConsumptionProfilingUsed eq 'NOT_APPLICABLE') == (#isEnergyConsumptionProfilingNotUsedRecorded != null)}",
	message = "noc.complianceroute.isEnergyConsumptionProfilingNotUsedRecorded")
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#partsProhibitedFromDisclosingExist) == (#partsProhibitedFromDisclosing != null)}", 
	message = "noc.complianceroute.partsProhibitedFromDisclosing")
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#partsProhibitedFromDisclosingExist) == (#partsProhibitedFromDisclosingReason != null)}", 
	message = "noc.complianceroute.partsProhibitedFromDisclosingReason")
public class ComplianceRoute implements NocP3Section {
	
	@NotEmpty
    @Builder.Default
    private Set<EstimatedCalculationType> estimatedCalculationTypes = new HashSet<>();
	
	private Boolean areTwelveMonthsVerifiableDataUsed;
	
	@Size(max = 10000)
	private String twelveMonthsVerifiableDataUsedReason;
	
	@NotNull
	private OptionalQuestion areEstimationMethodsRecorded;
		
	private EnergyConsumptionProfiling energyConsumptionProfilingUsed;
	
	private OptionalQuestion areEnergyConsumptionProfilingMethodsRecorded;

	private OptionalQuestion isEnergyConsumptionProfilingNotUsedRecorded;
	
	@Valid
    @Builder.Default
	private List<EnergyAudit> energyAudits = new ArrayList<>();
	
	@NotNull
	private Boolean partsProhibitedFromDisclosingExist;
	
    @Size(max = 10000)
	private String partsProhibitedFromDisclosing;
	
    @Size(max = 10000)
	private String partsProhibitedFromDisclosingReason;
}
