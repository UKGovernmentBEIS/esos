package uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain;

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
public class ProgressUpdate2P3MeasuresUpdate {

    @Valid
    @Builder.Default
    @Size(max = 100)
    private List<ProgressUpdate2P3UpdatedMeasure> progressUpdate2P3Measures = new ArrayList<>();

    @Valid
    @Builder.Default
    @Size(max = 100)
    private List<ProgressUpdate2P3UpdatedAddedMeasure> progressUpdate2P3UpdatedAddedMeasures = new ArrayList<>();

    @Valid
    @Builder.Default
    @Size(max = 50, message = "The list of energy efficiency measures cannot exceed 50 items")
    private List<ProgressUpdate2P3AddedMeasure> progressUpdate2P3AddedMeasure = new ArrayList<>();

}
