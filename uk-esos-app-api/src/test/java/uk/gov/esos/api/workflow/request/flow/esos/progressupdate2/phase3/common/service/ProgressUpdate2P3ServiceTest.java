package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.MeasureImplType;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3AddedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3MeasuresUpdate;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3UpdatedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.service.ProgressUpdate1P3QueryService;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3UpdatedAddedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3UpdatedMeasure;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.EstimationMethodType.OTHER_METHOD;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation.ESOS_ACTION_PLAN_COMPLIANCE;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate2P3ServiceTest {

    @InjectMocks
    private ProgressUpdate2P3Service progressUpdate1P3Service;

    @Mock
    private ProgressUpdate1P3QueryService queryService;

    @Mock
    private RequestQueryService requestQueryService;

    @Test
    void initializeProgressUpdateMeasuresTest(){
        Request request = Request.builder().accountId(1L).build();

        EnergyEfficiencyMeasure energyEfficiencyMeasure = EnergyEfficiencyMeasure.builder()
                .measureName("Test Measure")
                .measureContext("context")
                .implementationDateForMeasure(LocalDate.now().minusDays(2)) // Before submission date
                .build();

        List<ProgressUpdate1P3UpdatedMeasure> progressUpdate1P3UpdatedMeasures = new ArrayList<>();
        ProgressUpdate1P3UpdatedMeasure progressUpdate1P3UpdatedMeasure = new ProgressUpdate1P3UpdatedMeasure();
        progressUpdate1P3UpdatedMeasure.setMeasureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN);
        progressUpdate1P3UpdatedMeasure.setProgressUpdate1P3EnergyEfficiencyMeasure(getProgressUpdate1P3EnergyEfficiencyMeasure());
        progressUpdate1P3UpdatedMeasure.setActionPlanEnergyEfficiencyMeasure(energyEfficiencyMeasure);
        progressUpdate1P3UpdatedMeasure.setUuId(UUID.randomUUID());
        progressUpdate1P3UpdatedMeasures.add(progressUpdate1P3UpdatedMeasure);
        ProgressUpdate1P3MeasuresUpdate progressUpdate1P3MeasuresUpdate = new ProgressUpdate1P3MeasuresUpdate();
        progressUpdate1P3MeasuresUpdate.setProgressUpdate1P3Measures(progressUpdate1P3UpdatedMeasures);

        Set<ProgressUpdateP3Confirmation> confirmations = new HashSet<>();
        confirmations.add(ESOS_ACTION_PLAN_COMPLIANCE);
        confirmations.add(ProgressUpdateP3Confirmation.ESTIMATION_METHOD_DOCUMENTED);


        ProgressUpdate1P3 progressUpdate1P3 = ProgressUpdate1P3.builder()
                .progressUpdate1P3MeasuresUpdate(progressUpdate1P3MeasuresUpdate)
                .responsibleOfficerConfirmation(confirmations)
                .build();


        when(queryService.getProgressUpdate1ByAccountId(1L)).thenReturn(progressUpdate1P3);

        List<ProgressUpdate2P3UpdatedMeasure> result = progressUpdate1P3Service.initializeProgressUpdateMeasures(request);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.size());


    }

    @Test
    void testInitializeProgressUpdateMeasures_noMeasures() {
        Request request = Request.builder().accountId(1L).build();

        ProgressUpdate1P3 progressUpdate1P3 = ProgressUpdate1P3.builder().build();

        when(queryService.getProgressUpdate1ByAccountId(1L)).thenReturn(progressUpdate1P3);

        List<ProgressUpdate2P3UpdatedMeasure> result = progressUpdate1P3Service.initializeProgressUpdateMeasures(request);
        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    void initializeProgressUpdate1AddedMeasuresTest(){
        Request request = Request.builder().accountId(1L).build();

        EnergyEfficiencyMeasure energyEfficiencyMeasure = EnergyEfficiencyMeasure.builder()
                .measureName("Test Measure")
                .measureContext("context")
                .implementationDateForMeasure(LocalDate.now().minusDays(2)) // Before submission date
                .build();

        ProgressUpdate1P3AddedMeasure addedMeasure = ProgressUpdate1P3AddedMeasure.builder().measureName("measureName").build();

        List<ProgressUpdate1P3UpdatedMeasure> progressUpdate1P3UpdatedMeasures = new ArrayList<>();
        ProgressUpdate1P3UpdatedMeasure progressUpdate1P3UpdatedMeasure = new ProgressUpdate1P3UpdatedMeasure();
        progressUpdate1P3UpdatedMeasure.setMeasureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN);
        progressUpdate1P3UpdatedMeasure.setProgressUpdate1P3EnergyEfficiencyMeasure(getProgressUpdate1P3EnergyEfficiencyMeasure());
        progressUpdate1P3UpdatedMeasure.setActionPlanEnergyEfficiencyMeasure(energyEfficiencyMeasure);
        progressUpdate1P3UpdatedMeasure.setUuId(UUID.randomUUID());
        progressUpdate1P3UpdatedMeasures.add(progressUpdate1P3UpdatedMeasure);
        ProgressUpdate1P3MeasuresUpdate progressUpdate1P3MeasuresUpdate = new ProgressUpdate1P3MeasuresUpdate();
        progressUpdate1P3MeasuresUpdate.setProgressUpdate1P3Measures(progressUpdate1P3UpdatedMeasures);
        progressUpdate1P3MeasuresUpdate.setProgressUpdate1P3AddedMeasure(List.of(addedMeasure));

        Set<ProgressUpdateP3Confirmation> confirmations = new HashSet<>();
        confirmations.add(ESOS_ACTION_PLAN_COMPLIANCE);
        confirmations.add(ProgressUpdateP3Confirmation.ESTIMATION_METHOD_DOCUMENTED);


        ProgressUpdate1P3 progressUpdate1P3 = ProgressUpdate1P3.builder()
                .progressUpdate1P3MeasuresUpdate(progressUpdate1P3MeasuresUpdate)
                .responsibleOfficerConfirmation(confirmations)
                .build();

        when(queryService.getProgressUpdate1ByAccountId(1L)).thenReturn(progressUpdate1P3);

        List<ProgressUpdate2P3UpdatedAddedMeasure> result = progressUpdate1P3Service.initializeProgressUpdate1AddedMeasures(request);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.size());

    }

    private ProgressUpdate1P3EnergyEfficiencyMeasure getProgressUpdate1P3EnergyEfficiencyMeasure()  {
        return ProgressUpdate1P3EnergyEfficiencyMeasure.builder()
                .measureIsImplemented(true)
                .measureImplementedByTheDateInActionPlan(true)
                .estimationMethodType(OTHER_METHOD)
                .providedContext("test")
                .estimationMethodDescription("test")
                .reductionEnergyConsumption2023To2024(1l)
                .reductionEnergyConsumption2024To2025(1l)
                .estimationMethodDescription("test")
                .build();
    }

}