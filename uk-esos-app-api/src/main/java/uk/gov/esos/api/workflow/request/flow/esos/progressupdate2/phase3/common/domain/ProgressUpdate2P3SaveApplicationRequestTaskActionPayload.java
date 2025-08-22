package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3Payload;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskActionPayload;

import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ProgressUpdate2P3SaveApplicationRequestTaskActionPayload extends RequestTaskActionPayload {

    private ProgressUpdate2P3Payload progressUpdate2P3;

    @Builder.Default
    private Map<String, String> progressUpdate2P3SectionsCompleted = new HashMap<>();
}
