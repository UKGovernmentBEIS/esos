package uk.gov.esos.api.web.orchestrator.mireport.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.reporting.noc.phase3.domain.dto.NocP3SearchResultsDto;
import uk.gov.esos.api.reporting.noc.phase3.domain.dto.NocP3SearchResultsInfoDto;
import uk.gov.esos.api.reporting.noc.phase3.service.NocP3QueryService;
import uk.gov.esos.api.web.orchestrator.mireport.dto.NotificationOfCompliancesP3MiReportResult;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationOfCompliancesMiReportQueryOrchestrator {

    private final NocP3QueryService nocP3QueryService;

    public NotificationOfCompliancesP3MiReportResult generateP3(AccountType accountType, Long page, Long pageSize) {
        NocP3SearchResultsDto results = nocP3QueryService.findAll(accountType, page, pageSize);
        Map<String, NocP3SearchResultsInfoDto> nocs = results.getNocSearchResultsInfos().stream()
                .collect(Collectors.toMap(NocP3SearchResultsInfoDto::getId, data -> data));

        return NotificationOfCompliancesP3MiReportResult.builder()
                .reportType(MiReportType.NOC_SUBMITTED_DATA_P3)
                .results(nocs)
                .total(results.getTotal())
                .build();
    }
}
