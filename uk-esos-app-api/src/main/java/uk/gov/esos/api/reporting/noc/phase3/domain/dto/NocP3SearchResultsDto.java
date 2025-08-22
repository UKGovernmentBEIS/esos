package uk.gov.esos.api.reporting.noc.phase3.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NocP3SearchResultsDto {

    private List<NocP3SearchResultsInfoDto> nocSearchResultsInfos;
    private Long total;
}
