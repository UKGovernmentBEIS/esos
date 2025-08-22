package uk.gov.esos.api.mireport.organisation.progressupdate1submitteddata;

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
import uk.gov.esos.api.mireport.common.progressupdate1submitteddata.ProgressUpdate1ReportGenerator;
import uk.gov.esos.api.mireport.common.progressupdate1submitteddata.ProgressUpdate1SearchResults;
import uk.gov.esos.api.mireport.common.progressupdate1submitteddata.ProgressUpdate1SearchResultsInfo;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;
import uk.gov.esos.api.reporting.common.domain.Phase;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate1ReportGeneratorHandlerTest {

    @Mock
    private ProgressUpdate1CustomRepositoryImpl customRepository;

    @Mock
    private EntityManager mockEntityManager;

    private ProgressUpdate1ReportGeneratorHandler reportGeneratorHandler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        reportGeneratorHandler = new ProgressUpdate1ReportGeneratorHandler(customRepository);
    }

    @Test
    void testFindPU1PlanSubmittedData() {
        // Arrange
        ReportingSearchCriteria expectedCriteria = ReportingSearchCriteria.builder()
                .accountType(AccountType.ORGANISATION)
                .phase(Phase.PHASE_3)
                .build();

        ProgressUpdate1SearchResultsInfo searchResultsInfo = ProgressUpdate1SearchResultsInfo.builder()
                .pu1Id("pu1")
                .organisationName("name")
                .registrationNumber("number")
                .pu1SubmitDate(LocalDateTime.now())
                .actionPlanId("ap")
                .actionPlanSubmitDate(LocalDateTime.now())
                .build();

        ProgressUpdate1SearchResults expectedResults = new ProgressUpdate1SearchResults();
        expectedResults.setProgressUpdate1SearchResultsInfos(List.of(searchResultsInfo));

        when(customRepository.findAll(mockEntityManager, expectedCriteria))
                .thenReturn(expectedResults);

        // Act
        ProgressUpdate1SearchResults actualResults = reportGeneratorHandler.findProgressUpdate1SubmittedData(mockEntityManager);

        // Assert
        Assertions.assertEquals(expectedResults, actualResults);
        verify(customRepository, times(1))
                .findAll(mockEntityManager, expectedCriteria);
    }

    @Test
    void getReportTypeTest(){
        ProgressUpdate1ReportGenerator reportGenerator = new ProgressUpdate1ReportGeneratorHandler(customRepository);

        // Act: Call the getReportType method
        MiReportType result = reportGenerator.getReportType();

        // Assert: Verify the method returns the expected value
        Assertions.assertEquals(MiReportType.PROGRESS_UPDATE_1_SUBMITTED_DATA_P3, result);
    }


}