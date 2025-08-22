package uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.progressupdate.common.domain.AddedMeasureEstimationMethodType;
import uk.gov.esos.api.reporting.progressupdate.common.domain.MeasureSchemeType;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(
        expression = "{(#estimationMethodType eq 'OTHER_METHOD' && #estimationMethodDescription != null) || " +
                "(#estimationMethodType ne 'OTHER_METHOD' && #estimationMethodDescription == null)}",
        message = "pu.estimationMethodType.other"
)
@SpELExpression(
        expression = "(#measureScheme != null && #measureScheme.contains('OTHER')) || (#otherMeasureSchemeName == null)",
        message = "ap.otherMeasureSchemeName.other"
)
public class ProgressUpdate2P3AddedMeasure {

    @Size(max = 255)
    @NotEmpty
    private String measureName;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @JsonDeserialize(as = HashSet.class)
    private Set<MeasureSchemeType> measureScheme = new HashSet<>();

    @Size(max = 255)
    private String otherMeasureSchemeName;

    @Positive
    @NotNull
    private Long reductionEnergyConsumption2025To2026;

    @NotNull
    private AddedMeasureEstimationMethodType estimationMethodType;

    @Size(max = 10000)
    private String estimationMethodDescription;

    @Size(max = 10000)
    private String measureContext;
}
