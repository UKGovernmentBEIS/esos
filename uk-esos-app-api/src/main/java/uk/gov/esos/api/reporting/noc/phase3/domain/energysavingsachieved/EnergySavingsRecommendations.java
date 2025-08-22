package uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{((#energyAudits != null) || (#alternativeComplianceRoutes != null) || (#other != null)) ?" +
        "(T(java.util.stream.IntStream).of((#energyAudits eq null ? 0 : #energyAudits), " +
        "(#alternativeComplianceRoutes eq null ? 0 : #alternativeComplianceRoutes), (#other eq null ? 0 : #other)).sum() == #total) : #total == null}",
        message = "noc.energysavingsachieved.energySavingsRecommendations.sum")
public class EnergySavingsRecommendations {


    @Min(0)
    @Max(100)
    private Integer energyAudits;


    @Min(0)
    @Max(100)
    private Integer alternativeComplianceRoutes;


    @Min(0)
    @Max(100)
    private Integer other;


    @Min(0)
    private Integer total;

}
