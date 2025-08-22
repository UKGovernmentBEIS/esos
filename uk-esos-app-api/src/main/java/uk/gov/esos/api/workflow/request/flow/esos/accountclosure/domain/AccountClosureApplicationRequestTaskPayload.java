package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class AccountClosureApplicationRequestTaskPayload extends RequestTaskPayload {

    private AccountClosure accountClosure;

}
