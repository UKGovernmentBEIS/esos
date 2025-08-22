package uk.gov.esos.api.reporting.noc.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NocSearchResults {

    private List<NocSearchResultsInfo> nocSearchResultsInfos;
    private Long total;
}
