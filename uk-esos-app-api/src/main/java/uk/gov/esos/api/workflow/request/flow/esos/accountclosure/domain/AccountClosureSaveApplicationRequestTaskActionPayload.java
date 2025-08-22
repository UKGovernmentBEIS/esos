package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskActionPayload;


@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AccountClosureSaveApplicationRequestTaskActionPayload extends RequestTaskActionPayload {

    private AccountClosure accountClosure;

}
