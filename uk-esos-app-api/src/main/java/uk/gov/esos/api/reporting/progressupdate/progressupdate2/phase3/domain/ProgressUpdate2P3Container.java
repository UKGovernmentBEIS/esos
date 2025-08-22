package uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain.ProgressUpdate2Container;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ProgressUpdate2P3Container extends ProgressUpdate2Container {

    @Valid
    @NotNull
    private ProgressUpdate2P3 progressUpdate2P3;

}
