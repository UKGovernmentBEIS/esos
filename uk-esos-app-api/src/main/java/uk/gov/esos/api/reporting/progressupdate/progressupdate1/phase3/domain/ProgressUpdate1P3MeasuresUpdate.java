package uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressUpdate1P3MeasuresUpdate {

    @Valid
    @Builder.Default
    @Size(max = 100)
    private List<ProgressUpdate1P3UpdatedMeasure> progressUpdate1P3Measures = new ArrayList<>();

    @Valid
    @Builder.Default
    @Size(max = 50, message = "The list of energy efficiency measures cannot exceed 50 items")
    private List<ProgressUpdate1P3AddedMeasure> progressUpdate1P3AddedMeasure = new ArrayList<>();

}
