package uk.gov.esos.api.reporting.actionplan.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ActionPlanSubmitParams {

    private Long accountId;
    private ActionPlanContainer actionPlanContainer;
}
