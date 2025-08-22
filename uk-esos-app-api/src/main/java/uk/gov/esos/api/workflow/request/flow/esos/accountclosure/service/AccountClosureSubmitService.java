package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service;

import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountStatusUpdateService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.mapper.AccountClosureMapper;

@Service
@RequiredArgsConstructor
public class AccountClosureSubmitService {

    private final RequestService requestService;

    private final OrganisationAccountStatusUpdateService organisationAccountStatusUpdateService;

    private final AccountClosureValidationService validationService;

    private static final AccountClosureMapper ACCOUNT_CLOSURE_MAPPER = Mappers.getMapper(AccountClosureMapper.class);

    public void handleAccountClosureAction(Long accountId, RequestTask requestTask){
        Request request = requestTask.getRequest();
        AccountClosureRequestPayload requestPayload = (AccountClosureRequestPayload) request.getPayload();
        AccountClosureApplicationRequestTaskPayload applicationSubmitRequestTaskPayload =
                (AccountClosureApplicationRequestTaskPayload) requestTask.getPayload();

        try {
            validationService.validateAccountClosure(applicationSubmitRequestTaskPayload.getAccountClosure());
        }
        catch (ConstraintViolationException e){
            throw new BusinessException(ErrorCode.INVALID_ACCOUNT_CLOSURE);
        }

        // Update request payload
        requestPayload.setAccountClosure(applicationSubmitRequestTaskPayload.getAccountClosure());

        updateAccountStatusToClosed(accountId);
        addRequestAction(request);
    }

    private void addRequestAction(Request request) {
        AccountClosureRequestPayload requestPayload = (AccountClosureRequestPayload) request.getPayload();

        AccountClosureApplicationRequestActionPayload requestActionPayload =
                ACCOUNT_CLOSURE_MAPPER
                        .toAccountClosureApplicationRequestActionPayload(
                                requestPayload,
                                RequestActionPayloadType.ACCOUNT_CLOSURE_APPLICATION_SUBMITTED_PAYLOAD
                        );

        requestService.addActionToRequest(
                request,
                requestActionPayload,
                RequestActionType.ACCOUNT_CLOSURE_APPLICATION_SUBMITTED,
                requestPayload.getRegulatorAssignee()
        );
    }

    private void updateAccountStatusToClosed(Long accountId){
        organisationAccountStatusUpdateService.handleOrganisationAccountClosed(accountId);
    }

}
