package uk.gov.esos.api.workflow.request.flow.esos.noc.common.validation;

import lombok.RequiredArgsConstructor;

import uk.gov.esos.api.account.domain.enumeration.AccountStatus;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.services.resource.AccountAuthorizationResourceService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateAccountStatusValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateRequestTypeValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateByRequestValidator;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateValidatorService;

import java.util.Set;

@RequiredArgsConstructor
public abstract class RequestCreateNocRelatedValidator implements RequestCreateByRequestValidator<ReportRelatedRequestCreateActionPayload> {

    private final RequestCreateValidatorService requestCreateValidatorService;
    protected final AccountAuthorizationResourceService accountAuthorizationResourceService;
    protected final RequestQueryService requestQueryService;

    @Override
    public RequestCreateValidationResult validateAction(final Long accountId, ReportRelatedRequestCreateActionPayload payload, AppUser appUser) {
        RequestDetailsDTO requestDetailsDTO = requestQueryService
                .findRequestDetailsByIdAndAccountId(payload.getRequestId(), accountId);

        final RequestCreateValidationResult overallValidationResult = RequestCreateValidationResult.builder().valid(true).build();


        if(requestDetailsDTO.getRequestType() != this.getReferableRequestType()) {
            overallValidationResult.setValid(false);
        }

        // Check user permission
        if(!accountAuthorizationResourceService.hasUserScopeToAccountAndResourceSubType(appUser, accountId, Scope.REQUEST_CREATE, RequestCreateActionType.RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3.name())){
            return RequestCreateValidationResult.builder().valid(false).build();
        }

        RequestCreateAccountStatusValidationResult accountStatusValidationResult = requestCreateValidatorService
                .validateAccountStatuses(accountId, this.getApplicableAccountStatuses());
        if(!accountStatusValidationResult.isValid()) {
            overallValidationResult.setValid(false);
            overallValidationResult.setReportedAccountStatus(accountStatusValidationResult.getReportedAccountStatus());
            overallValidationResult.setApplicableAccountStatuses(this.getApplicableAccountStatuses());
        }

        RequestCreateRequestTypeValidationResult requestTypeValidationResult = this.validateRequestType(accountId, requestDetailsDTO);
        if(!requestTypeValidationResult.isValid()) {
            overallValidationResult.setValid(false);
            overallValidationResult.setReportedRequestTypes(requestTypeValidationResult.getReportedRequestTypes());
        }

        return overallValidationResult;
    }

    protected abstract RequestCreateRequestTypeValidationResult validateRequestType(Long accountId, RequestDetailsDTO requestDetailsDTO);

    protected abstract Set<AccountStatus> getApplicableAccountStatuses();

    protected abstract RequestType getReferableRequestType();
}
