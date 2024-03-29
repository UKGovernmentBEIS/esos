package uk.gov.esos.api.workflow.request.flow.common.domain.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.account.domain.enumeration.AccountStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestCreateAccountStatusValidationResult {
	
	private boolean valid;
    private AccountStatus reportedAccountStatus;

}
