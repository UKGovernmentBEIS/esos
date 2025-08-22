package uk.gov.esos.api.mireport.common.progressupdate1submitteddata;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1Container;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressUpdate1SearchResultsInfo {

    private String pu1Id;

    private String organisationName;

    private String registrationNumber;

    private LocalDateTime pu1SubmitDate;

    private String actionPlanId;

    private LocalDateTime actionPlanSubmitDate;

    private CompetentAuthorityEnum location;

    private ProgressUpdate1Container progressUpdate1Container;
}
