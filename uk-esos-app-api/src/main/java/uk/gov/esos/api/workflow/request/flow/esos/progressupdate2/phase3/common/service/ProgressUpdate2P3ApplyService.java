package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3AddedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3UpdatedAddedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3UpdatedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3UpdatedMeasurePayload;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3ApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3SaveApplicationRequestTaskActionPayload;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProgressUpdate2P3ApplyService {

    @Transactional
    public void applySaveAction(ProgressUpdate2P3SaveApplicationRequestTaskActionPayload taskActionPayload, RequestTask requestTask) {

        ProgressUpdate2P3ApplicationRequestTaskPayload taskPayload =
                (ProgressUpdate2P3ApplicationRequestTaskPayload) requestTask.getPayload();

        if(taskActionPayload.getProgressUpdate2P3() != null) {
            if (taskActionPayload.getProgressUpdate2P3().getProgressUpdate2P3MeasuresUpdate() != null) {
                List<ProgressUpdate2P3UpdatedMeasurePayload> userMeasures = taskActionPayload.getProgressUpdate2P3().getProgressUpdate2P3MeasuresUpdate().getProgressUpdate2P3Measures();
                List<ProgressUpdate2P3UpdatedMeasure> savedMeasures = taskPayload.getProgressUpdate2P3().getProgressUpdate2P3MeasuresUpdate().getProgressUpdate2P3Measures();
                List<ProgressUpdate2P3UpdatedAddedMeasure> savedUpdatedAddedMeasures = taskPayload.getProgressUpdate2P3().getProgressUpdate2P3MeasuresUpdate().getProgressUpdate2P3UpdatedAddedMeasures();

                Map<UUID, ProgressUpdate2P3UpdatedAddedMeasure> savedAddedMeasuresMap = createSavedAddedMeasuresMap(savedUpdatedAddedMeasures);

                Map<UUID, ProgressUpdate2P3UpdatedMeasure> savedMeasuresMap = createSavedMeasuresMap(savedMeasures);

                updateMeasures(savedAddedMeasuresMap, savedMeasuresMap, userMeasures);

                List<ProgressUpdate2P3AddedMeasure> addedMeasures = taskActionPayload.getProgressUpdate2P3()
                        .getProgressUpdate2P3MeasuresUpdate().getProgressUpdate2P3AddedMeasure();

                taskPayload.getProgressUpdate2P3().getProgressUpdate2P3MeasuresUpdate().setProgressUpdate2P3AddedMeasure(addedMeasures);
            }

            taskPayload.getProgressUpdate2P3().setGroupChange(taskActionPayload.getProgressUpdate2P3().getGroupChange());
            taskPayload.getProgressUpdate2P3().setResponsibleOfficerConfirmation(taskActionPayload.getProgressUpdate2P3().getResponsibleOfficerConfirmation());
        }

        taskPayload.setProgressUpdate2P3SectionsCompleted(taskActionPayload.getProgressUpdate2P3SectionsCompleted());
    }

    private Map<UUID, ProgressUpdate2P3UpdatedAddedMeasure> createSavedAddedMeasuresMap(List<ProgressUpdate2P3UpdatedAddedMeasure> savedUpdatedAddedMeasures){
       return savedUpdatedAddedMeasures != null ? savedUpdatedAddedMeasures.stream()
                .collect(Collectors.toMap(ProgressUpdate2P3UpdatedAddedMeasure::getUuId, measure -> measure)) : Collections.emptyMap();
    }

    private Map<UUID, ProgressUpdate2P3UpdatedMeasure> createSavedMeasuresMap(List<ProgressUpdate2P3UpdatedMeasure> savedMeasures){
        return savedMeasures != null ? savedMeasures.stream()
                .collect(Collectors.toMap(ProgressUpdate2P3UpdatedMeasure::getUuId, measure -> measure)) : Collections.emptyMap();
    }

    private void updateMeasures(Map<UUID, ProgressUpdate2P3UpdatedAddedMeasure> savedAddedMeasuresMap, Map<UUID, ProgressUpdate2P3UpdatedMeasure> savedMeasuresMap,
                                List<ProgressUpdate2P3UpdatedMeasurePayload> userMeasures){
        userMeasures.forEach(userMeasure -> {
            UUID measureId = userMeasure.getUuId();
            ProgressUpdate2P3EnergyEfficiencyMeasure efficiencyMeasure = userMeasure.getProgressUpdate2P3EnergyEfficiencyMeasure();
            Optional.ofNullable(savedMeasuresMap.get(measureId))
                    .ifPresent(savedMeasure -> savedMeasure.setProgressUpdate2P3EnergyEfficiencyMeasure(efficiencyMeasure));
            Optional.ofNullable(savedAddedMeasuresMap.get(measureId))
                    .ifPresent(savedAddedMeasure -> savedAddedMeasure.setProgressUpdate2P3EnergyEfficiencyMeasure(efficiencyMeasure));
        });
    }

}