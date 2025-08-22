package uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain;

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
        expression =
                "(#progressUpdate1P3MeasuresUpdate != null && " +
                        "#progressUpdate1P3MeasuresUpdate.progressUpdate1P3Measures != null && " +
                        "#progressUpdate1P3MeasuresUpdate.progressUpdate1P3Measures.size() > 0 && " +
                        "#progressUpdate1P3MeasuresUpdate.progressUpdate1P3Measures.?[" +
                        "    #this.progressUpdate1P3EnergyEfficiencyMeasure.estimationMethodType == 'OTHER_METHOD' " +
                        "].size() > 0) || " +
                        "(#progressUpdate1P3MeasuresUpdate != null && " +
                        "#progressUpdate1P3MeasuresUpdate.progressUpdate1P3AddedMeasure != null && " +
                        "#progressUpdate1P3MeasuresUpdate.progressUpdate1P3AddedMeasure.?[" +
                        "    #this.estimationMethodType == 'OTHER_METHOD' " +
                        "].size() > 0) " +
                        "? " +
                        "(#responsibleOfficerConfirmation != null && " +
                        "#responsibleOfficerConfirmation.contains('ESOS_ACTION_PLAN_COMPLIANCE') && " +
                        "#responsibleOfficerConfirmation.contains('ESTIMATION_METHOD_DOCUMENTED')) " +
                        ": " +
                        "(#responsibleOfficerConfirmation != null && " +
                        "#responsibleOfficerConfirmation.contains('ESOS_ACTION_PLAN_COMPLIANCE') && " +
                        "#responsibleOfficerConfirmation.size() == 1)",
        message = "pu.responsibleOfficerConfirmationType"
)

public class ProgressUpdate1P3 {

    @Valid
    private GroupChange groupChange;

    @Valid
    @NotNull
    private ProgressUpdate1P3MeasuresUpdate progressUpdate1P3MeasuresUpdate;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<ProgressUpdateP3Confirmation> responsibleOfficerConfirmation = new HashSet<>();

}
