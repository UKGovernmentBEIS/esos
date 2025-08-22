package uk.gov.esos.api.reporting.actionplan.phase3.domain;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{((#buildings != null) || (#transport != null) " +
        "|| (#industrialProcesses != null) || (#otherProcesses != null)) ?" +
        "(T(java.util.stream.LongStream).of(" +
        "(#buildings eq null ? 0 : #buildings), " +
        "(#transport eq null ? 0 : #transport), " +
        "(#industrialProcesses eq null ? 0 : #industrialProcesses), " +
        "(#otherProcesses eq null ? 0 : #otherProcesses)).sum() == #total) : #total == null}",
        message = "ap.energysavings.sum")
public class TotalEnergySavingsExpected {

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

    @Positive
    private Long total;
}
