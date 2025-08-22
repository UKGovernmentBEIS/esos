package uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProgressUpdate1SubmitParams {

    private Long accountId;

    private ProgressUpdate1Container progressUpdate1Container;

    private boolean  isDisaggregateUndertaking;

}
