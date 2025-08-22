package uk.gov.esos.api.reporting.noc.phase3.domain;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@SpELExpression(expression = "{((#buildings != null) || (#transport != null) " +
		"|| (#industrialProcesses != null) || (#otherProcesses != null)) ?" +
		"(T(java.util.stream.LongStream).of(" +
		"(#buildings eq null ? 0 : #buildings), " +
		"(#transport eq null ? 0 : #transport), " +
		"(#industrialProcesses eq null ? 0 : #industrialProcesses), " +
		"(#otherProcesses eq null ? 0 : #otherProcesses)).sum() == #total) : #total == null}",
		message = "noc.energyconsumption.sum")
public class EnergyConsumption {

    @Min(0)
	@Digits(integer = 15, fraction = 0)
	private Long buildings;

    @Min(0)
	@Digits(integer = 15, fraction = 0)
	private Long transport;

    @Min(0)
	@Digits(integer = 15, fraction = 0)
	private Long industrialProcesses;

    @Min(0)
	@Digits(integer = 15, fraction = 0)
	private Long otherProcesses;

	@PositiveOrZero
	private Long total;
}
