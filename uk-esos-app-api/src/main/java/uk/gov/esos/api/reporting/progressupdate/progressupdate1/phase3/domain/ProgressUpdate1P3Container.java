package uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1Container;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ProgressUpdate1P3Container extends ProgressUpdate1Container {

    @Valid
    @NotNull
    private ProgressUpdate1P3 progressUpdate1P3;

}
