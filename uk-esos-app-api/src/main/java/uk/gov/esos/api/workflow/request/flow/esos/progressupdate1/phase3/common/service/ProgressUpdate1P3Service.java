package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.actionplan.common.service.ActionPlanQueryService;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.MeasureImplType;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3UpdatedMeasure;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProgressUpdate1P3Service {

    private final RequestQueryService requestQueryService;
    private final ActionPlanQueryService actionPlanQueryService;

    public List<ProgressUpdate1P3UpdatedMeasure> initializeProgressUpdateMeasures(Request request){

        ActionPlanP3 actionPlanP3 = actionPlanQueryService.getActionPlanP3ByAccountId(request.getAccountId());

        List<ProgressUpdate1P3UpdatedMeasure> progressUpdate1P3Measures = new ArrayList<>();

        if(actionPlanP3.getEnergyEfficiencyMeasure() != null && actionPlanP3.getEnergyEfficiencyMeasure().getEnergyEfficiencyMeasures() != null) {
            List<EnergyEfficiencyMeasure> energyEfficiencyMeasures = actionPlanP3.getEnergyEfficiencyMeasure().getEnergyEfficiencyMeasures();

            for (EnergyEfficiencyMeasure measure : energyEfficiencyMeasures) {
                ProgressUpdate1P3UpdatedMeasure puMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                        .uuId(UUID.randomUUID())
                        .actionPlanEnergyEfficiencyMeasure(measure)
                        .measureImplType(calculateMeasureImplType(request, measure.getImplementationDateForMeasure()))
                        .build();
                progressUpdate1P3Measures.add(puMeasure);
            }

            return progressUpdate1P3Measures;
        }
        return List.of();
    }

    private MeasureImplType calculateMeasureImplType(Request request, LocalDate implMeasureDate){
        //we need the last day for the impl measure month
        implMeasureDate = implMeasureDate.with(TemporalAdjusters.lastDayOfMonth());
        Request actionPlanRequest = requestQueryService.findByAccountAndType(request.getAccountId(), RequestType.ACTION_PLAN_P3);
        LocalDateTime apSbmDate =  actionPlanRequest.getSubmissionDate();
        if(apSbmDate == null){
            throw new BusinessException(ErrorCode.PROGRESS_UPDATE_1_P3_MISSING_ACTION_PLAN_SBM_DATE);
        }

        return implMeasureDate.isBefore(apSbmDate.toLocalDate()) ? MeasureImplType.MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN
                : MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN;
    }

}
