package uk.gov.esos.api.mireport.common.actionplansubmitteddata;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.mireport.common.domain.dto.EmptyMiReportParams;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportResult;

@RequiredArgsConstructor
public abstract  class ActionPlanReportGenerator {

    public abstract ActionPlanSearchResults findActionPlanSubmittedData(EntityManager entityManager);

    public MiReportType getReportType() {
        return MiReportType.ACTION_PLAN_SUBMITTED_DATA_P3;
    }

    @Transactional(readOnly = true)
    public MiReportResult generateMiReport(EntityManager entityManager, EmptyMiReportParams reportParams) {
        return findActionPlanSubmittedData(entityManager);
    }
}
