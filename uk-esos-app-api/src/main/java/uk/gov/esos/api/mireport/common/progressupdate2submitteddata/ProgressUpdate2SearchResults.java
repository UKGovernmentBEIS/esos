package uk.gov.esos.api.mireport.common.progressupdate2submitteddata;

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
public class ProgressUpdate2SearchResults extends MiReportResult {

    private List<ProgressUpdate2SearchResultsInfo> progressUpdate2SearchResultsInfos;

}
