package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3AddedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3UpdatedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.service.ProgressUpdate1P3QueryService;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3UpdatedAddedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3UpdatedMeasure;
import uk.gov.esos.api.workflow.request.core.domain.Request;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProgressUpdate2P3Service {

    private final ProgressUpdate1P3QueryService progressUpdate1P3QueryService;

    public List<ProgressUpdate2P3UpdatedMeasure> initializeProgressUpdateMeasures(Request request) {

        ProgressUpdate1P3 pu1 = progressUpdate1P3QueryService.getProgressUpdate1ByAccountId(request.getAccountId());

        List<ProgressUpdate2P3UpdatedMeasure> initializedProgressUpdate2P3Measures = new ArrayList<>();

        if (!ObjectUtils.isEmpty(pu1.getProgressUpdate1P3MeasuresUpdate()) && !ObjectUtils.isEmpty(pu1.getProgressUpdate1P3MeasuresUpdate().getProgressUpdate1P3Measures())) {
            List<ProgressUpdate1P3UpdatedMeasure> pu1measures = pu1.getProgressUpdate1P3MeasuresUpdate().getProgressUpdate1P3Measures();

            for (ProgressUpdate1P3UpdatedMeasure m : pu1measures) {
                ProgressUpdate2P3UpdatedMeasure progressUpdate2P3UpdatedMeasure = ProgressUpdate2P3UpdatedMeasure.builder()
                        .actionPlanEnergyEfficiencyMeasure(m.getActionPlanEnergyEfficiencyMeasure())
                        .progressUpdate1P3EnergyEfficiencyMeasure(m.getProgressUpdate1P3EnergyEfficiencyMeasure())
                        .uuId(UUID.randomUUID())
                        .build();
                initializedProgressUpdate2P3Measures.add(progressUpdate2P3UpdatedMeasure);
            }
            return initializedProgressUpdate2P3Measures;
        }

        return List.of();
    }

    public List<ProgressUpdate2P3UpdatedAddedMeasure> initializeProgressUpdate1AddedMeasures(Request request) {
        ProgressUpdate1P3 pu1 = progressUpdate1P3QueryService.getProgressUpdate1ByAccountId(request.getAccountId());

        if(!ObjectUtils.isEmpty(pu1.getProgressUpdate1P3MeasuresUpdate()) && !ObjectUtils.isEmpty(pu1.getProgressUpdate1P3MeasuresUpdate().getProgressUpdate1P3AddedMeasure())) {
            List<ProgressUpdate1P3AddedMeasure> addedMeasures = pu1.getProgressUpdate1P3MeasuresUpdate().getProgressUpdate1P3AddedMeasure();
            List<ProgressUpdate2P3UpdatedAddedMeasure> addedMeasureInitiations = new ArrayList<>();
            for (ProgressUpdate1P3AddedMeasure addedMeasure : addedMeasures) {
                ProgressUpdate2P3UpdatedAddedMeasure addedMeasureInitiation = ProgressUpdate2P3UpdatedAddedMeasure.builder()
                        .uuId(UUID.randomUUID())
                        .progressUpdate1P3AddedMeasure(addedMeasure)
                        .build();
                addedMeasureInitiations.add(addedMeasureInitiation);
            }

            return addedMeasureInitiations;
        }

        return List.of();
    }

}
