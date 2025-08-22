package uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#energyResponsibilityType ne 'NOT_RESPONSIBLE') == (#complianceRouteDistribution != null)}",
        message = "noc.reportingObligationDetails.energyResponsibilityType.complianceRouteDistribution")
public class ReportingObligationDetails {


    @NotNull
    private OrganisationQualificationReasonType qualificationReasonType;

    @NotNull
    private OrganisationEnergyResponsibilityType energyResponsibilityType;

    @Valid
    private ComplianceRouteDistribution complianceRouteDistribution;
}
