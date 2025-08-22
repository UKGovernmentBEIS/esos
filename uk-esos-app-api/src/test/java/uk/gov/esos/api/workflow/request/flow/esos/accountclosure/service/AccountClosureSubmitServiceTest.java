package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service;

import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountStatusUpdateService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosure;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureRequestPayload;

import static org.junit.Assert.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.anyLong;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

class AccountClosureSubmitServiceTest {

    @Mock
    private RequestService requestService;

    @Mock
    private OrganisationAccountStatusUpdateService organisationAccountStatusUpdateService;

    @Mock
    private AccountClosureValidationService validationService;

    @InjectMocks
    private AccountClosureSubmitService accountClosureSubmitService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testHandleAccountClosureAction_ValidAccountClosure() {
        // Arrange
        Long accountId = 123L;
        AccountClosure accountClosure = new AccountClosure(); // Configure fields as needed

        AccountClosureRequestPayload requestPayload = new AccountClosureRequestPayload();
        AccountClosureApplicationRequestTaskPayload applicationSubmitRequestTaskPayload =
                new AccountClosureApplicationRequestTaskPayload();
        applicationSubmitRequestTaskPayload.setAccountClosure(accountClosure);

        Request request = new Request();
        request.setPayload(requestPayload);

        RequestTask requestTask = new RequestTask();
        requestTask.setRequest(request);
        requestTask.setPayload(applicationSubmitRequestTaskPayload);

        // Act
        accountClosureSubmitService.handleAccountClosureAction(accountId, requestTask);

        verify(validationService).validateAccountClosure(accountClosure);
        verify(organisationAccountStatusUpdateService).handleOrganisationAccountClosed(accountId);
        verify(requestService).addActionToRequest(
                eq(request),
                any(AccountClosureApplicationRequestActionPayload.class),
                eq(RequestActionType.ACCOUNT_CLOSURE_APPLICATION_SUBMITTED),
                eq(requestPayload.getRegulatorAssignee())
        );
    }

    @Test
    public void testHandleAccountClosureAction_InvalidAccountClosure() {
        // Arrange
        Long accountId = 123L;
        AccountClosure accountClosure = new AccountClosure(); // Configure fields as needed

        AccountClosureRequestPayload requestPayload = new AccountClosureRequestPayload();
        AccountClosureApplicationRequestTaskPayload applicationSubmitRequestTaskPayload =
                new AccountClosureApplicationRequestTaskPayload();
        applicationSubmitRequestTaskPayload.setAccountClosure(accountClosure);

        Request request = new Request();
        request.setPayload(requestPayload);

        RequestTask requestTask = new RequestTask();
        requestTask.setRequest(request);
        requestTask.setPayload(applicationSubmitRequestTaskPayload);

        doThrow(new ConstraintViolationException(null)).when(validationService).validateAccountClosure(accountClosure);

        assertThrows(BusinessException.class, () ->
                accountClosureSubmitService.handleAccountClosureAction(accountId, requestTask));

        // Verify that no further actions were taken due to the validation exception
        verify(organisationAccountStatusUpdateService, never()).handleOrganisationAccountClosed(anyLong());
        verify(requestService, never()).addActionToRequest(any(), any(), any(), any());
    }

}