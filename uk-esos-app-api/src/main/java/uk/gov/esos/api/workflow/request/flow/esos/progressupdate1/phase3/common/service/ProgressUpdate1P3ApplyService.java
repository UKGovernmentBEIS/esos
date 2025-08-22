package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3AddedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3UpdatedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3UpdatedMeasurePayload;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3ApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3SaveApplicationRequestTaskActionPayload;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProgressUpdate1P3ApplyService {

    /**
     * Saves the data from user
     *
     * @param taskActionPayload : the user payload data
     * @param requestTask       : the task from request_task table
     */
    @Transactional
    public void applySaveAction(ProgressUpdate1P3SaveApplicationRequestTaskActionPayload taskActionPayload, RequestTask requestTask) {

        ProgressUpdate1P3ApplicationRequestTaskPayload taskPayload =
                (ProgressUpdate1P3ApplicationRequestTaskPayload) requestTask.getPayload();

        if (taskActionPayload.getProgressUpdate1P3() != null && taskActionPayload.getProgressUpdate1P3()
                .getProgressUpdate1P3MeasuresUpdate() != null) {

            List<ProgressUpdate1P3UpdatedMeasurePayload> userMeasures = taskActionPayload.getProgressUpdate1P3()
                    .getProgressUpdate1P3MeasuresUpdate().getProgressUpdate1P3Measures();

            List<ProgressUpdate1P3UpdatedMeasure> savedMeasures = taskPayload.getProgressUpdate1P3().getProgressUpdate1P3MeasuresUpdate().getProgressUpdate1P3Measures();

            Map<UUID, ProgressUpdate1P3UpdatedMeasure> savedMeasuresMap = savedMeasures != null ? savedMeasures.stream()
                    .collect(Collectors.toMap(ProgressUpdate1P3UpdatedMeasure::getUuId, sm -> sm)) : Collections.emptyMap();

            userMeasures.forEach(m -> Optional.ofNullable(savedMeasuresMap.get(m.getUuId()))
                    .ifPresent(sm -> sm.setProgressUpdate1P3EnergyEfficiencyMeasure(m.getProgressUpdate1P3EnergyEfficiencyMeasure()))
            );

            List<ProgressUpdate1P3AddedMeasure> addedMeasures = taskActionPayload.getProgressUpdate1P3()
                    .getProgressUpdate1P3MeasuresUpdate().getProgressUpdate1P3AddedMeasure();

            taskPayload.getProgressUpdate1P3().getProgressUpdate1P3MeasuresUpdate().setProgressUpdate1P3AddedMeasure(addedMeasures);

        }

        if(taskActionPayload.getProgressUpdate1P3() != null) {
            taskPayload.getProgressUpdate1P3().setGroupChange(taskActionPayload.getProgressUpdate1P3().getGroupChange());
            taskPayload.getProgressUpdate1P3().setResponsibleOfficerConfirmation(taskActionPayload.getProgressUpdate1P3().getResponsibleOfficerConfirmation());
        }

        taskPayload.setProgressUpdate1P3SectionsCompleted(taskActionPayload.getProgressUpdate1P3SectionsCompleted());

    }

}