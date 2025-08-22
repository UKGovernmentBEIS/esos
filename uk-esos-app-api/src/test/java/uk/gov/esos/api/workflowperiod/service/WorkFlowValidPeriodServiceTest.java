package uk.gov.esos.api.workflowperiod.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.workflowperiod.domain.WorkFlowValidPeriod;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflowperiod.repository.WorkFlowValidPeriodRepository;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;


@ExtendWith(MockitoExtension.class)
public class WorkFlowValidPeriodServiceTest {

    @InjectMocks
    private WorkFlowValidPeriodService workFlowValidPeriodService;

    @Mock
    private WorkFlowValidPeriodRepository workFlowValidPeriodRepository;


    @Test
    public void findWorkFlowValidPeriodByTypeTest_Found() {
        // Arrange
        WorkFlowValidPeriod expectedWorkFlowValidPeriod = new WorkFlowValidPeriod();
        when(workFlowValidPeriodRepository.findWorkFlowValidPeriodByType(RequestType.ACTION_PLAN_P3))
                .thenReturn(Optional.of(expectedWorkFlowValidPeriod));

        WorkFlowValidPeriod actualWorkFlowValidPeriod = workFlowValidPeriodService.findWorkFlowValidPeriodByType(RequestType.ACTION_PLAN_P3);

        Assertions.assertNotNull(actualWorkFlowValidPeriod);
        Assertions.assertEquals(expectedWorkFlowValidPeriod, actualWorkFlowValidPeriod);
        verify(workFlowValidPeriodRepository, times(1)).findWorkFlowValidPeriodByType(RequestType.ACTION_PLAN_P3);
    }

    @Test
    public void testIsValidDate_WithinValidInitiateRange() {
        LocalDateTime now = LocalDateTime.now();

        WorkFlowValidPeriod validPeriod = WorkFlowValidPeriod.builder()
                .initiateStartDate(now.minusDays(1))
                .initiateEndDate(now.plusDays(1))
                .build();

        boolean result = workFlowValidPeriodService.isValidDate(validPeriod.getInitiateStartDate(), validPeriod.getInitiateEndDate());
        // Assert
        Assertions.assertTrue(result);
    }

    @Test
    public void testIsValidDate_AfterEndInitiateDate() {
        LocalDateTime now = LocalDateTime.now();

        WorkFlowValidPeriod validPeriod = WorkFlowValidPeriod.builder()
                .initiateStartDate(now.minusDays(2))
                .initiateEndDate(now.minusDays(1))
                .build();


        boolean result = workFlowValidPeriodService.isValidDate(validPeriod.getInitiateStartDate(), validPeriod.getInitiateEndDate());

        // Assert
        Assertions.assertFalse(result);

    }

    @Test
    public void testIsValidDate_Before_Start_InitiateDate() {
        LocalDateTime now = LocalDateTime.now();

        WorkFlowValidPeriod validPeriod = WorkFlowValidPeriod.builder()
                .initiateStartDate(now.plusDays(1))
                .initiateEndDate(now.plusDays(2))
                .build();

        boolean result = workFlowValidPeriodService.isValidDate(validPeriod.getInitiateStartDate(), validPeriod.getInitiateEndDate());

        Assertions.assertFalse(result);

    }

    @Test
    public void testIsValidDate_OnStartInitiateDate() {
        LocalDateTime now = LocalDateTime.now();

        WorkFlowValidPeriod validPeriod = WorkFlowValidPeriod.builder()
                .initiateStartDate(now)
                .initiateEndDate(now.plusDays(1))
                .build();
        boolean result = workFlowValidPeriodService.isValidDate(validPeriod.getInitiateStartDate(), validPeriod.getInitiateEndDate());

        // Assert
        Assertions.assertTrue(result); // Should return true as the current date is the end date
    }

    @Test
    public void testIsValidDate_OnEndInitiateDate() {
        LocalDateTime now = LocalDateTime.now();

        WorkFlowValidPeriod validPeriod = WorkFlowValidPeriod.builder()
                .initiateStartDate(now.minusDays(1))
                .initiateEndDate(now.plusNanos(100000000)) //needs a delay cause "now" here and "now" in workFlowValidPeriodService.isValidInitiateDate() has milliseconds difference
                .build();
        boolean result = workFlowValidPeriodService.isValidDate(validPeriod.getInitiateStartDate(), validPeriod.getInitiateEndDate());

        // Assert
        Assertions.assertTrue(result);
    }

}
