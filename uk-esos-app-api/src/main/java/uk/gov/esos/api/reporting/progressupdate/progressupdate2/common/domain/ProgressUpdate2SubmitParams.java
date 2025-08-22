package uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProgressUpdate2SubmitParams {

    private Long accountId;

    private ProgressUpdate2Container progressUpdate2Container;

    private boolean  isDisaggregateUndertaking;
}
