package uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.progressupdate.common.domain.GroupChange;
import uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(
        expression = "{(#progressUpdate2P3MeasuresUpdate != null && " +
                "(#progressUpdate2P3MeasuresUpdate?.progressUpdate2P3Measures?.size() > 0 || " +
                "#progressUpdate2P3MeasuresUpdate?.progressUpdate2P3UpdatedAddedMeasures?.size() > 0) && " +
                "(#progressUpdate2P3MeasuresUpdate.progressUpdate2P3Measures.?[" +
                "progressUpdate2P3EnergyEfficiencyMeasure?.estimationMethodType == 'OTHER_METHOD'].size() > 0 " +

                "|| " +

                "#progressUpdate2P3MeasuresUpdate.progressUpdate2P3UpdatedAddedMeasures.?[" +
                "progressUpdate2P3EnergyEfficiencyMeasure?.estimationMethodType == 'OTHER_METHOD'].size() > 0))" +

                "|| " +

                "#progressUpdate2P3MeasuresUpdate.progressUpdate2P3AddedMeasure.?[" +
                "estimationMethodType == 'OTHER_METHOD' ].size() > 0" +

                " ? " +

                "(#responsibleOfficerConfirmation?.contains('ESOS_ACTION_PLAN_COMPLIANCE') && " +
                "#responsibleOfficerConfirmation?.contains('ESTIMATION_METHOD_DOCUMENTED')) " +
                ": " +
                "(#responsibleOfficerConfirmation?.contains('ESOS_ACTION_PLAN_COMPLIANCE') && " +
                "#responsibleOfficerConfirmation?.size() == 1)}",
        message = "pu.responsibleOfficerConfirmationType"
)
public class ProgressUpdate2P3 {

    @Valid
    private GroupChange groupChange;

    @Valid
    @NotNull
    private ProgressUpdate2P3MeasuresUpdate progressUpdate2P3MeasuresUpdate;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<ProgressUpdateP3Confirmation> responsibleOfficerConfirmation = new HashSet<>();
}
