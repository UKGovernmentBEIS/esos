package uk.gov.esos.api.workflow.request.flow.common.domain;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskActionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PeerReviewRequestTaskActionPayload extends RequestTaskActionPayload {

    @NotBlank
    private String peerReviewer;
}
