package uk.gov.esos.api.reporting.noc.phase3.domain.firstcomplianceperiod;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;
import uk.gov.esos.api.reporting.noc.phase3.domain.OptionalQuestion;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@SpELExpression(expression = "{(#informationExists eq 'YES') == (#firstCompliancePeriodDetails != null)}",
	message = "noc.complianceperiod.energyconsumption.details")
public class FirstCompliancePeriod implements NocP3Section {

	@NotNull
	private OptionalQuestion informationExists;
	
	@Valid
	private FirstCompliancePeriodDetails firstCompliancePeriodDetails;
}
