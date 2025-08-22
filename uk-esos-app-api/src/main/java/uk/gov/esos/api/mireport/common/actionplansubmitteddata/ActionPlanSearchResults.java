package uk.gov.esos.api.mireport.common.actionplansubmitteddata;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportResult;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ActionPlanSearchResults extends MiReportResult {

    private List<ActionPlanSearchResultsInfo> actionPlanSearchResultsInfos;

}
