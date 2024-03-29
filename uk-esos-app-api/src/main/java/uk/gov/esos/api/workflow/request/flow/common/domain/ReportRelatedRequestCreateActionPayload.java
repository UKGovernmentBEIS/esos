package uk.gov.esos.api.workflow.request.flow.common.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import uk.gov.esos.api.workflow.request.core.domain.RequestCreateActionPayload;

import jakarta.validation.constraints.NotBlank;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ReportRelatedRequestCreateActionPayload extends RequestCreateActionPayload {

    @NotBlank
    private String requestId;
}
