package uk.gov.esos.api.mireport.organisation.progressupdate2submitteddata;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.mireport.common.progressupdate2submitteddata.ProgressUpdate2ReportGenerator;
import uk.gov.esos.api.mireport.common.progressupdate2submitteddata.ProgressUpdate2SearchResults;
import uk.gov.esos.api.mireport.common.progressupdate2submitteddata.ProgressUpdate2SearchResultsInfo;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;
import uk.gov.esos.api.mireport.organisation.progressupdate2submitteddata.ProgressUpdate2CustomRepositoryImpl;
import uk.gov.esos.api.mireport.organisation.progressupdate2submitteddata.ProgressUpdate2ReportGeneratorHandler;
import uk.gov.esos.api.reporting.common.domain.Phase;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate2ReportGeneratorHandlerTest {

    @Mock
    private ProgressUpdate2CustomRepositoryImpl customRepository;

    @Mock
    private EntityManager mockEntityManager;

    private ProgressUpdate2ReportGeneratorHandler reportGeneratorHandler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        reportGeneratorHandler = new ProgressUpdate2ReportGeneratorHandler(customRepository);
    }

    @Test
    void testFindPU2PlanSubmittedData() {
        // Arrange
        ReportingSearchCriteria expectedCriteria = ReportingSearchCriteria.builder()
                .accountType(AccountType.ORGANISATION)
                .phase(Phase.PHASE_3)
                .build();

        ProgressUpdate2SearchResultsInfo searchResultsInfo = ProgressUpdate2SearchResultsInfo.builder()
                .pu1Id("pu1")
                .pu2Id("pu2")
                .organisationName("name")
                .registrationNumber("number")
                .pu1SubmitDate(LocalDateTime.now())
                .actionPlanId("ap")
                .actionPlanSubmitDate(LocalDateTime.now())
                .build();

        ProgressUpdate2SearchResults expectedResults = new ProgressUpdate2SearchResults();
        expectedResults.setProgressUpdate2SearchResultsInfos(List.of(searchResultsInfo));

        when(customRepository.findAll(mockEntityManager, expectedCriteria))
                .thenReturn(expectedResults);

        // Act
        ProgressUpdate2SearchResults actualResults = reportGeneratorHandler.findProgressUpdate2SubmittedData(mockEntityManager);

        // Assert
        Assertions.assertEquals(expectedResults, actualResults);
        verify(customRepository, times(1))
                .findAll(mockEntityManager, expectedCriteria);
    }

    @Test
    void getReportTypeTest(){
        ProgressUpdate2ReportGenerator reportGenerator = new ProgressUpdate2ReportGeneratorHandler(customRepository);

        // Act: Call the getReportType method
        MiReportType result = reportGenerator.getReportType();

        // Assert: Verify the method returns the expected value
        Assertions.assertEquals(MiReportType.PROGRESS_UPDATE_2_SUBMITTED_DATA_P3, result);
    }

}