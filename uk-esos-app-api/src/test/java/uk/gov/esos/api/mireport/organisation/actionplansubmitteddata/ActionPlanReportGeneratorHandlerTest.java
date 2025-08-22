package uk.gov.esos.api.mireport.organisation.actionplansubmitteddata;

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
import uk.gov.esos.api.mireport.common.actionplansubmitteddata.ActionPlanReportGenerator;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;
import uk.gov.esos.api.mireport.common.actionplansubmitteddata.ActionPlanSearchResults;
import uk.gov.esos.api.mireport.common.actionplansubmitteddata.ActionPlanSearchResultsInfo;
import uk.gov.esos.api.reporting.common.domain.Phase;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ActionPlanReportGeneratorHandlerTest {

    @Mock
    private ActionPlanCustomRepositoryImpl mockActionPlanCustomRepository;

    @Mock
    private EntityManager mockEntityManager;

    private ActionPlanReportGeneratorHandler actionPlanReportGeneratorHandler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        actionPlanReportGeneratorHandler = new ActionPlanReportGeneratorHandler(mockActionPlanCustomRepository);
    }

    @Test
    void testFindActionPlanSubmittedData() {
        // Arrange
        ReportingSearchCriteria expectedCriteria = ReportingSearchCriteria.builder()
                .accountType(AccountType.ORGANISATION)
                .phase(Phase.PHASE_3)
                .build();

        ActionPlanSearchResultsInfo actionPlanSearchResultsInfo = ActionPlanSearchResultsInfo.builder()
                .actionPlanId("AP_ID")
                .organisationName("ORG_NAME")
                .registrationNumber("REG_NUMBER")
                .actionPlanSubmitDate(LocalDateTime.now())
                .nocId("NOC_ID")
                .nocSubmitDate(LocalDateTime.now())
                .build();

        ActionPlanSearchResults expectedResults = new ActionPlanSearchResults();
        expectedResults.setActionPlanSearchResultsInfos(List.of(actionPlanSearchResultsInfo));

        when(mockActionPlanCustomRepository.findAll(mockEntityManager, expectedCriteria))
                .thenReturn(expectedResults);

        // Act
        ActionPlanSearchResults actualResults = actionPlanReportGeneratorHandler.findActionPlanSubmittedData(mockEntityManager);

        // Assert
        Assertions.assertEquals(expectedResults, actualResults);
        verify(mockActionPlanCustomRepository, times(1))
                .findAll(mockEntityManager, expectedCriteria);
    }

    @Test
    void getReportTypeTest(){
        ActionPlanReportGenerator reportGenerator = new ActionPlanReportGeneratorHandler(mockActionPlanCustomRepository);

        // Act: Call the getReportType method
        MiReportType result = reportGenerator.getReportType();

        // Assert: Verify the method returns the expected value
        Assertions.assertEquals(MiReportType.ACTION_PLAN_SUBMITTED_DATA_P3, result);
    }

}