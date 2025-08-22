package uk.gov.esos.api.mireport.common.actionplansubmitteddata;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanContainer;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActionPlanSearchResultsInfo {

    private String actionPlanId;

    private String nocId;

    private String organisationName;

    private String registrationNumber;

    private LocalDateTime nocSubmitDate;
    private LocalDateTime actionPlanSubmitDate;

    private CompetentAuthorityEnum location;

    private ActionPlanContainer actionPlanContainer;
}
