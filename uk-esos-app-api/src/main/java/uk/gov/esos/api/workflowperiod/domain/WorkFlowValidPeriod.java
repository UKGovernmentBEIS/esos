package uk.gov.esos.api.workflowperiod.domain;

import jakarta.persistence.*;
import lombok.*;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "workflow_valid_period")

/*
   defines the period a work flow can start/submitted
 */
public class WorkFlowValidPeriod {

    @Id
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private RequestType type;

    @Column(name = "initiate_start_date")
    private LocalDateTime initiateStartDate;

    @Column(name = "initiate_end_date")
    private LocalDateTime initiateEndDate;

    @Column(name = "submit_start_date")
    private LocalDateTime submitStartDate;

    @Column(name = "submit_end_date")
    private LocalDateTime submitEndDate;

}
