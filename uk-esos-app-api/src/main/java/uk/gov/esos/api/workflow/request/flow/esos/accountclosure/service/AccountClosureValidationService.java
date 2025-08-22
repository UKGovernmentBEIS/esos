package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosure;

@Service
@Validated
public class AccountClosureValidationService {

    public void validateAccountClosure(@NotNull @Valid AccountClosure accountClosure) {

    }

}
