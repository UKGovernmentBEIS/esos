package uk.gov.esos.api.web.orchestrator.mireport.dto;

import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.reporting.noc.phase3.domain.dto.NocP3SearchResultsInfoDto;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationOfCompliancesP3MiReportResult {

    @NotNull
    private MiReportType reportType;

    private Map<String, NocP3SearchResultsInfoDto> results;

    @NotNull
    private Long total;
}
