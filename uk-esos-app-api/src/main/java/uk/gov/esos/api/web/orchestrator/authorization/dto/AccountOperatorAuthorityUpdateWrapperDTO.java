package uk.gov.esos.api.web.orchestrator.authorization.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.account.domain.enumeration.AccountContactType;
import uk.gov.esos.api.authorization.operator.domain.AccountOperatorAuthorityUpdateDTO;
import uk.gov.esos.api.web.orchestrator.authorization.validate.AccountOperatorAuthorityUpdate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

@AccountOperatorAuthorityUpdate
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountOperatorAuthorityUpdateWrapperDTO {

    @NotNull
    @Valid
    private List<AccountOperatorAuthorityUpdateDTO> accountOperatorAuthorityUpdateList;

    @NotNull
    private Map<AccountContactType, String> contactTypes;
    
}
