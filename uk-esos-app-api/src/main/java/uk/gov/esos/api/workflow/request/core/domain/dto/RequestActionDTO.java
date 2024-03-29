package uk.gov.esos.api.workflow.request.core.domain.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.core.domain.RequestActionPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestActionDTO {

    private Long id;
    
    private RequestActionType type;

    private RequestActionPayload payload;
    
    private String requestId;
    
    private RequestType requestType;
    
    private Long requestAccountId;
    
    private CompetentAuthorityEnum competentAuthority;

    private String submitter;

    private LocalDateTime creationDate;

}
