package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3Payload;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskActionPayload;

import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ProgressUpdate1P3SaveApplicationRequestTaskActionPayload extends RequestTaskActionPayload {
    
    private ProgressUpdate1P3Payload progressUpdate1P3;

    @Builder.Default
    private Map<String, String> progressUpdate1P3SectionsCompleted = new HashMap<>();
}
