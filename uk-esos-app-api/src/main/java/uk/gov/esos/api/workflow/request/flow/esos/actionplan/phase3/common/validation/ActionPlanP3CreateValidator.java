package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.validation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.domain.enumeration.AccountStatus;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflowperiod.service.WorkFlowValidPeriodService;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateAccountRelatedValidator;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateValidatorService;

import java.util.Set;

@Slf4j
@Service
public class ActionPlanP3CreateValidator extends RequestCreateAccountRelatedValidator {

    private final RequestQueryService requestQueryService;

    private final WorkFlowValidPeriodService workFlowValidPeriodService;


    public ActionPlanP3CreateValidator(final RequestCreateValidatorService requestCreateValidatorService,
                                       final RequestQueryService requestQueryService, WorkFlowValidPeriodService workFlowValidPeriodService) {
        super(requestCreateValidatorService);
        this.requestQueryService = requestQueryService;
        this.workFlowValidPeriodService = workFlowValidPeriodService;
    }

    @Override
    public RequestCreateValidationResult validateAction(final Long accountId) {
        if(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS) ||
                requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.COMPLETED)) {
            return RequestCreateValidationResult.builder()
                    .valid(false)
                    .reportedRequestTypes(Set.of(RequestType.ACTION_PLAN_P3))
                    .build();
        }

        if(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS) ||
                requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.COMPLETED)) {
            return RequestCreateValidationResult.builder()
                    .valid(false)
                    .build();
        }

        if(!workFlowValidPeriodService.isValidStartDate(RequestType.ACTION_PLAN_P3)){
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
        return RequestCreateActionType.ACTION_PLAN_P3;
    }

}
