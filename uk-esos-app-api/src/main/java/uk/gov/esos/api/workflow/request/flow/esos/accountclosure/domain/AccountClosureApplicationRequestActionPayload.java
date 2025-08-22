package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.RequestActionPayload;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AccountClosureApplicationRequestActionPayload extends RequestActionPayload {

   private AccountClosure accountClosure;

    private LocalDateTime submitDate;
}
