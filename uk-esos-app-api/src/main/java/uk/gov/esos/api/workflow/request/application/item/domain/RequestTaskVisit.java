package uk.gov.esos.api.workflow.request.application.item.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@IdClass(RequestTaskVisitPK.class)
@Table(name = "request_task_visit")
public class RequestTaskVisit {

    @Id
    private Long taskId;

    @Id
    @NotNull
    private String userId;
}
