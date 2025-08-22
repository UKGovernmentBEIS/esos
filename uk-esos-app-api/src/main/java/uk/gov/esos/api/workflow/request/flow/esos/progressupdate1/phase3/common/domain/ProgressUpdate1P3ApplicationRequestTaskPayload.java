package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressUpdate1P3ApplicationRequestTaskPayload extends RequestTaskPayload {

    private Boolean isDisaggregateUndertaking;

    private ProgressUpdate1P3 progressUpdate1P3;

    @Builder.Default
    private Map<String, String> progressUpdate1P3SectionsCompleted = new HashMap<>();

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    private Map<UUID, String> progressUpdate1P3Attachments = new HashMap<>();

    @Override
    public Map<UUID, String> getAttachments() {
        return getProgressUpdate1P3Attachments();
    }
}
