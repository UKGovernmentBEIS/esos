package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.common.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.actionplan.common.service.ActionPlanQueryService;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanEnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.MeasureImplType;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3UpdatedMeasure;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.service.ProgressUpdate1P3Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate1P3ServiceTest {

    @InjectMocks
    private ProgressUpdate1P3Service progressUpdate1P3Service;

    @Mock
    private ActionPlanQueryService actionPlanQueryService;

    @Mock
    private RequestQueryService requestQueryService;

    @Test
    void testCalculateMeasureImplType_after_Submit_within_same_month() {
        Request actionPlanRequest = Request.builder()
                .accountId(1L)
                .submissionDate(LocalDateTime.now().minusDays(1))  // Before implementation date
                .build();

        Request request = Request.builder().accountId(1L).build();

        when(requestQueryService.findByAccountAndType(1L, RequestType.ACTION_PLAN_P3))
                .thenReturn(actionPlanRequest);

        EnergyEfficiencyMeasure energyEfficiencyMeasure = EnergyEfficiencyMeasure.builder()
                .measureName("Test Measure")
                .implementationDateForMeasure(LocalDate.now().minusDays(2)) // Before submission date
                .build();

        ActionPlanP3 actionPlanP3 = ActionPlanP3.builder()
                .energyEfficiencyMeasure(ActionPlanEnergyEfficiencyMeasure.builder()
                        .energyEfficiencyMeasures(Collections.singletonList(energyEfficiencyMeasure))
                        .build())
                .build();

        when(actionPlanQueryService.getActionPlanP3ByAccountId(actionPlanRequest.getAccountId())).thenReturn(actionPlanP3);

        List<ProgressUpdate1P3UpdatedMeasure> result = progressUpdate1P3Service.initializeProgressUpdateMeasures(request);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.size());
        Assertions.assertEquals(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN, result.get(0).getMeasureImplType());
    }

    @Test
    void testCalculateMeasureImplType_afterSubmit() {

        Request request = Request.builder().accountId(1L).build();

        Request actionPlanRequest = Request.builder()
                .accountId(1L)
                .submissionDate(LocalDateTime.now().minusDays(2))  // After implementation date
                .build();

        when(requestQueryService.findByAccountAndType(1l, RequestType.ACTION_PLAN_P3))
                .thenReturn(actionPlanRequest);

        EnergyEfficiencyMeasure energyEfficiencyMeasure = EnergyEfficiencyMeasure.builder()
                .measureName("Test Measure")
                .implementationDateForMeasure(LocalDate.now().plusDays(1)) // After submission date
                .build();

        ActionPlanP3 actionPlanP3 = ActionPlanP3.builder()
                .energyEfficiencyMeasure(ActionPlanEnergyEfficiencyMeasure.builder()
                        .energyEfficiencyMeasures(Collections.singletonList(energyEfficiencyMeasure))
                        .build())
                .build();

        when(actionPlanQueryService.getActionPlanP3ByAccountId(request.getAccountId())).thenReturn(actionPlanP3);

        List<ProgressUpdate1P3UpdatedMeasure> result = progressUpdate1P3Service.initializeProgressUpdateMeasures(request);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.size());
        Assertions.assertEquals(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN, result.get(0).getMeasureImplType());
    }

    @Test
    void testInitializeProgressUpdateMeasures_noMeasures() {
        Request request = Request.builder().accountId(1L).build();

        ActionPlanP3 actionPlanP3 = ActionPlanP3.builder()
                .energyEfficiencyMeasure(null)
                .build();

        when(actionPlanQueryService.getActionPlanP3ByAccountId(1L)).thenReturn(actionPlanP3);

        List<ProgressUpdate1P3UpdatedMeasure> result = progressUpdate1P3Service.initializeProgressUpdateMeasures(request);
        Assertions.assertTrue(result.isEmpty());
    }


}