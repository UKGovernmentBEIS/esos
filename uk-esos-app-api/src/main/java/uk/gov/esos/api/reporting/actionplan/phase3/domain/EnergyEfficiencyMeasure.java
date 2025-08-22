package uk.gov.esos.api.reporting.actionplan.phase3.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.progressupdate.common.domain.MeasureSchemeType;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(
        expression = "{#implementationDateForMeasure != null &&" +
                "T(java.time.LocalDate).parse(#implementationDateForMeasure).isAfter(T(java.time.LocalDate).of(2023, 11, 30))}",
        message = "ap.implementation.date"
)
@SpELExpression(
        expression = "{(#energySavingsEstimateCalculatedType eq 'OTHER_REASONABLE_ESTIMATION_METHOD' && #estimationMethodDescription != null) || " +
                "(#energySavingsEstimateCalculatedType ne 'OTHER_REASONABLE_ESTIMATION_METHOD' && #estimationMethodDescription == null)}",
        message = "ap.energySavingsEstimateCalculatedType.other"
)
/*
If "OTHER" is not present in measureScheme (or measureScheme is null), otherMeasureSchemeName must be null.
If "OTHER" is present, otherMeasureSchemeName can be null or any value, making it optional for the user.
 */
@SpELExpression(
        expression = "(#measureScheme == null || !#measureScheme.contains('OTHER')) ? #otherMeasureSchemeName == null : true",
        message = "ap.otherMeasureSchemeName.other"
)
public class EnergyEfficiencyMeasure {

    @NotBlank
    @Size(max = 255)
    private String measureName;

    @NotNull
    private Boolean isEnergySavingsOpportunityReportedInAudit;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @JsonDeserialize(as = HashSet.class)
    private Set<MeasureSchemeType> measureScheme = new HashSet<>();

    @Size(max = 255)
    private String otherMeasureSchemeName;

    @Valid
    private TotalEnergySavingsExpected totalEnergySavingsExpected;

    @NotNull
    private LocalDate implementationDateForMeasure;

    @NotNull
    private EnergySavingsEstimateCalculatedType energySavingsEstimateCalculatedType;

    @Size(max = 10000)
    private String estimationMethodDescription;

    @Size(max = 10000)
    private String measureContext;

}
