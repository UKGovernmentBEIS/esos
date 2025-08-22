package uk.gov.esos.api.mireport.common.progressupdate2submitteddata;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.mireport.common.domain.dto.EmptyMiReportParams;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportResult;

@RequiredArgsConstructor
public abstract class ProgressUpdate2ReportGenerator {

    public abstract ProgressUpdate2SearchResults findProgressUpdate2SubmittedData(EntityManager entityManager);

    public MiReportType getReportType() {
        return MiReportType.PROGRESS_UPDATE_2_SUBMITTED_DATA_P3;
    }

    @Transactional(readOnly = true)
    public MiReportResult generateMiReport(EntityManager entityManager, EmptyMiReportParams reportParams) {
        return findProgressUpdate2SubmittedData(entityManager);
    }
}
