package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.validation;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.account.domain.enumeration.AccountStatus;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateAccountRelatedValidator;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateValidatorService;
import uk.gov.esos.api.workflowperiod.service.WorkFlowValidPeriodService;

import java.util.Set;

@Service
public class NotificationOfComplianceP3CreateValidator extends RequestCreateAccountRelatedValidator {

    private final RequestQueryService requestQueryService;

    private final WorkFlowValidPeriodService workFlowValidPeriodService;

    public NotificationOfComplianceP3CreateValidator(final RequestCreateValidatorService requestCreateValidatorService,
                                                     final RequestQueryService requestQueryService, WorkFlowValidPeriodService workFlowValidPeriodService) {
        super(requestCreateValidatorService);
        this.requestQueryService = requestQueryService;
        this.workFlowValidPeriodService = workFlowValidPeriodService;
    }

    @Override
    public RequestCreateValidationResult validateAction(final Long accountId) {
        if(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.NOTIFICATION_OF_COMPLIANCE_P3)) {
            return RequestCreateValidationResult.builder()
                    .valid(false)
                    .reportedRequestTypes(Set.of(RequestType.NOTIFICATION_OF_COMPLIANCE_P3))
                    .build();
        }

        if (!workFlowValidPeriodService.isValidStartDate(RequestType.NOTIFICATION_OF_COMPLIANCE_P3)) {
            return RequestCreateValidationResult.builder()
                    .valid(false)
                    .build();
        }

        return super.validateAction(accountId);
    }

    @Override
    protected Set<AccountStatus> getApplicableAccountStatuses() {
        return Set.of(OrganisationAccountStatus.LIVE);
    }

    @Override
    protected Set<RequestType> getMutuallyExclusiveRequests() {
        return Set.of();
    }

    @Override
    public RequestCreateActionType getType() {
        return RequestCreateActionType.NOTIFICATION_OF_COMPLIANCE_P3;
    }
}
