package uk.gov.esos.api.web.orchestrator.mireport.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.dto.NocP3SearchResultsDto;
import uk.gov.esos.api.reporting.noc.phase3.domain.dto.NocP3SearchResultsInfoDto;
import uk.gov.esos.api.reporting.noc.phase3.service.NocP3QueryService;
import uk.gov.esos.api.web.orchestrator.mireport.dto.NotificationOfCompliancesP3MiReportResult;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationOfCompliancesMiReportQueryOrchestratorTest {

    @InjectMocks
    private NotificationOfCompliancesMiReportQueryOrchestrator orchestrator;

    @Mock
    private NocP3QueryService nocP3QueryService;

    @Test
    void generateP3() {
        final AccountType accountType = AccountType.ORGANISATION;
        final long page = 0;
        final long pageSize = 10;
        final long total = 1L;
        final String nocId = "NOC001";
        final NocP3SearchResultsInfoDto infoDto = NocP3SearchResultsInfoDto.builder().id(nocId).noc(NocP3.builder().build()).build();
        final NocP3SearchResultsDto resultsDto = NocP3SearchResultsDto.builder()
                .nocSearchResultsInfos(List.of(infoDto))
                .total(total)
                .build();


        final NotificationOfCompliancesP3MiReportResult expected =
                NotificationOfCompliancesP3MiReportResult.builder()
                        .reportType(MiReportType.NOC_SUBMITTED_DATA_P3)
                        .results(Map.of(nocId, infoDto))
                        .total(total)
                        .build();

        when(nocP3QueryService.findAll(accountType, page, pageSize))
                .thenReturn(resultsDto);

        // Invoke
        NotificationOfCompliancesP3MiReportResult actual = orchestrator.generateP3(accountType, page, pageSize);

        // Verify
        assertThat(actual).isEqualTo(expected);
        verify(nocP3QueryService, times(1)).findAll(accountType, page, pageSize);
    }
}
