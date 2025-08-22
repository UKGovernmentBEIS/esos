package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.handler;


import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ResponsibleOfficerConfirmationType;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.TotalEnergySavingsExpected;
import uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3UpdatedMeasure;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.service.ProgressUpdate1P3Service;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.domain.ProgressUpdate1P3ApplicationSubmitRequestTaskPayload;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.reporting.actionplan.phase3.domain.EnergySavingsEstimateCalculatedType.ENERGY_AUDIT;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.MeasureSchemeType.CLIMATE_CHANGE_AGREEMENTS_CCA;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate1P3ApplicationSubmitInitializerRequestTaskHandlerTest {

    @Mock
    private ProgressUpdate1P3Service progressUpdate1P3Service;

    @InjectMocks
    private ProgressUpdate1P3ApplicationSubmitInitializerRequestTaskHandler handler;


    @Test
    void initializePayload() {
        final Request request = Request.builder()
                .accountId(1L)
                .payload(ProgressUpdate1P3RequestPayload.builder()
                        .isDisaggregateUndertaking(false)
                        .payloadType(RequestPayloadType.PROGRESS_UPDATE_1_P3_REQUEST_PAYLOAD)
                        .build())
                .build();

        TotalEnergySavingsExpected totalEnergySavingsExpected = TotalEnergySavingsExpected.builder()
                .buildings(1L)
                .transport(1L)
                .otherProcesses(1L)
                .industrialProcesses(1L)
                .build();

        EnergyEfficiencyMeasure energyEfficiencyMeasure = EnergyEfficiencyMeasure.builder()
                .measureName("Measure 1")
                .measureScheme(Set.of(CLIMATE_CHANGE_AGREEMENTS_CCA))
                .measureContext("Measure Context")
                .isEnergySavingsOpportunityReportedInAudit(true)
                .implementationDateForMeasure(LocalDate.now())
                .energySavingsEstimateCalculatedType(ENERGY_AUDIT)
                .totalEnergySavingsExpected(totalEnergySavingsExpected)
                .build();

        ProgressUpdate1P3UpdatedMeasure progressUpdate1P3UpdatedMeasure =  ProgressUpdate1P3UpdatedMeasure.builder()
                .actionPlanEnergyEfficiencyMeasure(energyEfficiencyMeasure)
                .build();


        List<ProgressUpdate1P3UpdatedMeasure> measures = List.of(progressUpdate1P3UpdatedMeasure);

        when(progressUpdate1P3Service.initializeProgressUpdateMeasures(request)).thenReturn(measures);

        RequestTaskPayload result = handler.initializePayload(request);

        assertNotNull(result);
        assertInstanceOf(ProgressUpdate1P3ApplicationSubmitRequestTaskPayload.class, result);

        ProgressUpdate1P3ApplicationSubmitRequestTaskPayload payload =
                (ProgressUpdate1P3ApplicationSubmitRequestTaskPayload) result;

        assertNotNull(payload.getProgressUpdate1P3());
        assertNotNull(payload.getProgressUpdate1P3().getProgressUpdate1P3MeasuresUpdate());
        assertNotNull(payload.getProgressUpdate1P3().getProgressUpdate1P3MeasuresUpdate().getProgressUpdate1P3Measures());
        assertEquals(1, payload.getProgressUpdate1P3().getProgressUpdate1P3MeasuresUpdate().getProgressUpdate1P3Measures().size());
        assertEquals(progressUpdate1P3UpdatedMeasure, payload.getProgressUpdate1P3().getProgressUpdate1P3MeasuresUpdate().getProgressUpdate1P3Measures().get(0));

        assertEquals(RequestTaskPayloadType.PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT_PAYLOAD, payload.getPayloadType());

        verify(progressUpdate1P3Service, times(1)).initializeProgressUpdateMeasures(request);
    }

    @Test
    void initializePayload_empty() {
        final Request request = Request.builder()
                .accountId(1L)
                .payload(ProgressUpdate1P3RequestPayload.builder()
                        .isDisaggregateUndertaking(true)
                        .payloadType(RequestPayloadType.PROGRESS_UPDATE_1_P3_REQUEST_PAYLOAD)
                        .build())
                .build();

        RequestTaskPayload result = handler.initializePayload(request);

        assertNotNull(result);
        assertInstanceOf(ProgressUpdate1P3ApplicationSubmitRequestTaskPayload.class, result);

        ProgressUpdate1P3ApplicationSubmitRequestTaskPayload payload =
                (ProgressUpdate1P3ApplicationSubmitRequestTaskPayload) result;

        Assertions.assertTrue(payload.getProgressUpdate1P3().getProgressUpdate1P3MeasuresUpdate().getProgressUpdate1P3Measures().isEmpty());

        assertEquals(RequestTaskPayloadType.PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT_PAYLOAD, payload.getPayloadType());

        verify(progressUpdate1P3Service, times(0)).initializeProgressUpdateMeasures(request);
    }

    @Test
    void initializePayload_from_request() {
        final Map<String, String> sectionsCompleted = Map.of("key", "completed");
        final ProgressUpdate1P3 pu1 = ProgressUpdate1P3.builder()
                .responsibleOfficerConfirmation(Set.of(ProgressUpdateP3Confirmation.ESOS_ACTION_PLAN_COMPLIANCE)).build();

        final Request request = Request.builder()
                .payload(ProgressUpdate1P3RequestPayload.builder()
                        .payloadType(RequestPayloadType.PROGRESS_UPDATE_1_P3_REQUEST_PAYLOAD)
                        .progressUpdate1P3(pu1)
                        .progressUpdate1P3SectionsCompleted(sectionsCompleted)
                        .build())
                .build();

        final ProgressUpdate1P3ApplicationSubmitRequestTaskPayload expected =
                ProgressUpdate1P3ApplicationSubmitRequestTaskPayload.builder()
                        .payloadType(RequestTaskPayloadType.PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT_PAYLOAD)
                        .progressUpdate1P3(pu1)
                        .progressUpdate1P3SectionsCompleted(sectionsCompleted)
                        .build();

        // Invoke
        RequestTaskPayload actual = handler.initializePayload(request);

        verify(progressUpdate1P3Service, times(0)).initializeProgressUpdateMeasures(request);

        // Verify
        assertThat(actual)
                .isInstanceOf(ProgressUpdate1P3ApplicationSubmitRequestTaskPayload.class)
                .isEqualTo(expected);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(handler.getRequestTaskTypes()).containsExactly(RequestTaskType.PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT);
    }

}