package uk.gov.esos.api.mireport.common.progressupdate2submitteddata;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain.ProgressUpdate2Container;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressUpdate2SearchResultsInfo {

    private String pu2Id;
    private String organisationName;
    private String registrationNumber;
    private LocalDateTime pu2SubmitDate;

    // ap info
    private String actionPlanId;
    private LocalDateTime actionPlanSubmitDate;

    // pu1 info
    private String pu1Id;
    private LocalDateTime pu1SubmitDate;

    private CompetentAuthorityEnum location;

    private ProgressUpdate2Container progressUpdate2Container;
}
