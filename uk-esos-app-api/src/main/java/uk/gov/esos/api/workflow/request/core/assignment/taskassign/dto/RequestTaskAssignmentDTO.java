package uk.gov.esos.api.workflow.request.core.assignment.taskassign.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * The Request Task Assignment Data Transfer Object.
 */
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class RequestTaskAssignmentDTO {

	/**
	 * The task id to be assigned
	 */
    @NotNull
    private Long taskId;

    /**
     * The user to assign the task to
     */
    @NotBlank
    private String userId;
}
