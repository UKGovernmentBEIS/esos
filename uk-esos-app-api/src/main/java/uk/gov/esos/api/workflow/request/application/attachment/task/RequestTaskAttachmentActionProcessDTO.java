package uk.gov.esos.api.workflow.request.application.attachment.task;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestTaskAttachmentActionProcessDTO {

    @NotNull
    private Long requestTaskId;

    @NotNull
    private RequestTaskActionType requestTaskActionType;

}
