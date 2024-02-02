package uk.gov.esos.api.mireport.common.accountsregulatorsitecontacts;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportResult;

import java.util.List;


@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AccountAssignedRegulatorSiteContactsMiReportResult extends MiReportResult {

    private List<AccountAssignedRegulatorSiteContact> results;
}
