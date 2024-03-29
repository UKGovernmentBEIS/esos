package uk.gov.esos.api.workflow.request.application.item.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public abstract class ItemDTO {

    /** item fields **/
    private LocalDateTime creationDate;

    /** request fields **/
    private String requestId;

    private RequestType requestType;

    /** request task fields **/
    private Long taskId;

    @JsonUnwrapped
    private ItemAssigneeDTO itemAssignee;

    private RequestTaskType taskType;

    private Long daysRemaining;

    @JsonProperty("isNew")
    private boolean isNew;
}
