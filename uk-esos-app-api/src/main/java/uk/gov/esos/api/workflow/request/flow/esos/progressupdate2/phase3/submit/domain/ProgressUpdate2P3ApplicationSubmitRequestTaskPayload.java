package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3ApplicationRequestTaskPayload;

@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class ProgressUpdate2P3ApplicationSubmitRequestTaskPayload extends ProgressUpdate2P3ApplicationRequestTaskPayload {
}
