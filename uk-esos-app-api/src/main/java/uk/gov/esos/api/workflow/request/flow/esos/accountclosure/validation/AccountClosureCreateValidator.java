package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.validation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.domain.enumeration.AccountStatus;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateAccountRelatedValidator;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateValidatorService;

import java.util.Set;

@Slf4j
@Service
public class AccountClosureCreateValidator extends RequestCreateAccountRelatedValidator {

    private final RequestQueryService requestQueryService;

    public AccountClosureCreateValidator(final RequestCreateValidatorService requestCreateValidatorService,
                                       final RequestQueryService requestQueryService) {
        super(requestCreateValidatorService);
        this.requestQueryService = requestQueryService;
    }

    @Override
    protected Set<AccountStatus> getApplicableAccountStatuses() {
        return Set.of(OrganisationAccountStatus.LIVE);
    }

    @Override
    protected Set<RequestType> getMutuallyExclusiveRequests() {
        return Set.of(RequestType.ACCOUNT_CLOSURE);
    }

    @Override
    public RequestCreateActionType getType() {
        return RequestCreateActionType.ACCOUNT_CLOSURE;
    }
}
