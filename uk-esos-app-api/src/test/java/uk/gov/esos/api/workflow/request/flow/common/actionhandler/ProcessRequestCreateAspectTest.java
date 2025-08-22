package uk.gov.esos.api.workflow.request.flow.common.actionhandler;

import org.aspectj.lang.JoinPoint;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.account.service.AccountQueryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateByAccountValidator;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateByRequestValidator;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.domain.OrganisationAccountOpeningSubmitApplicationCreateActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.service.OrganisationAccountOpeningCreateValidator;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.validation.NotificationOfComplianceP3ReInitiateValidator;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.validation.ProgressUpdate1P3ReInitiateValidator;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.validation.ProgressUpdate2P3ReInitiateValidator;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProcessRequestCreateAspectTest {

    private ProcessRequestCreateAspect aspect;

    @Mock
    private OrganisationAccountOpeningCreateValidator organisationAccountOpeningCreateValidator;

    @Mock
    private NotificationOfComplianceP3ReInitiateValidator notificationOfComplianceP3ReInitiateValidator;

    @Mock
    private ProgressUpdate1P3ReInitiateValidator progressUpdate1P3ReInitiateValidator;

    @Mock
    private ProgressUpdate2P3ReInitiateValidator progressUpdate2P3ReInitiateValidator;

    @Mock
    private AccountQueryService accountQueryService;

    @Spy
    private ArrayList<RequestCreateByAccountValidator> requestCreateByAccountValidators;

    @Spy
    private ArrayList<RequestCreateByRequestValidator> requestCreateByRequestValidators;
    
    @Mock
    private JoinPoint joinPoint;

    @BeforeEach
    void setUp() {
    	requestCreateByAccountValidators.add(organisationAccountOpeningCreateValidator);
        requestCreateByRequestValidators.add(notificationOfComplianceP3ReInitiateValidator);
        requestCreateByRequestValidators.add(progressUpdate1P3ReInitiateValidator);
        requestCreateByRequestValidators.add(progressUpdate2P3ReInitiateValidator);

		aspect = new ProcessRequestCreateAspect(requestCreateByAccountValidators, requestCreateByRequestValidators,
                accountQueryService);
    }

    @Test
    void process_account_opening_request_type() {
        final RequestCreateActionType type = RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION;
        final OrganisationAccountOpeningSubmitApplicationCreateActionPayload payload = OrganisationAccountOpeningSubmitApplicationCreateActionPayload.builder().build();
        final AppUser currentUser = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[] {
                null, type, payload, currentUser
        };

        RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();

        when(joinPoint.getArgs()).thenReturn(arguments);
        when(organisationAccountOpeningCreateValidator.getType()).thenReturn(type);
        when(organisationAccountOpeningCreateValidator.validateAction(null)).thenReturn(validationResult);

        aspect.process(joinPoint);

        verify(joinPoint, times(1)).getArgs();
        verify(organisationAccountOpeningCreateValidator, times(1)).getType();
        verify(organisationAccountOpeningCreateValidator, times(1)).validateAction(null);
        verifyNoInteractions(accountQueryService);
    }

    @Test
    void process_account_re_initiate_noc() {
        final long accountId = 1L;
        final RequestCreateActionType type = RequestCreateActionType.RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3;
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId("NOC000001-P3")
                .build();
        final AppUser currentUser = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[] { accountId, type, payload, currentUser };

        when(joinPoint.getArgs()).thenReturn(arguments);
        when(notificationOfComplianceP3ReInitiateValidator.getType()).thenReturn(type);
        when(accountQueryService.getAccountType(accountId)).thenReturn(AccountType.ORGANISATION);
        when(notificationOfComplianceP3ReInitiateValidator.validateAction(accountId, payload, currentUser))
                .thenReturn(RequestCreateValidationResult.builder().valid(true).build());

        // Invoke
        aspect.process(joinPoint);

        // Verify
        verify(joinPoint, times(1)).getArgs();
        verify(notificationOfComplianceP3ReInitiateValidator, times(1)).getType();
        verify(accountQueryService, times(1)).getAccountType(accountId);
        verify(accountQueryService, times(1)).exclusiveLockAccount(accountId);
        verify(notificationOfComplianceP3ReInitiateValidator, times(1))
                .validateAction(accountId, payload, currentUser);
    }

    @Test
    void process_account_re_initiate_noc_not_valid() {
        final long accountId = 1L;
        final RequestCreateActionType type = RequestCreateActionType.RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3;
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId("NOC000001-P3")
                .build();
        final AppUser currentUser = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[] { accountId, type, payload, currentUser };

        when(joinPoint.getArgs()).thenReturn(arguments);
        when(notificationOfComplianceP3ReInitiateValidator.getType()).thenReturn(type);
        when(accountQueryService.getAccountType(accountId)).thenReturn(AccountType.ORGANISATION);
        when(notificationOfComplianceP3ReInitiateValidator.validateAction(accountId, payload, currentUser))
                .thenReturn(RequestCreateValidationResult.builder().valid(false).build());

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
                () -> aspect.process(joinPoint));

        // Verify
        assertThat(businessException.getErrorCode()).isEqualTo(ErrorCode.REQUEST_CREATE_ACTION_NOT_ALLOWED);
        verify(joinPoint, times(1)).getArgs();
        verify(notificationOfComplianceP3ReInitiateValidator, times(1)).getType();
        verify(accountQueryService, times(1)).getAccountType(accountId);
        verify(accountQueryService, times(1)).exclusiveLockAccount(accountId);
        verify(notificationOfComplianceP3ReInitiateValidator, times(1))
                .validateAction(accountId, payload, currentUser);
    }

    @Test
    void process_type_not_allowed() {
        final long accountId = 1L;
        final RequestCreateActionType type = RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION;
        final OrganisationAccountOpeningSubmitApplicationCreateActionPayload payload = OrganisationAccountOpeningSubmitApplicationCreateActionPayload.builder().build();
        final AppUser currentUser = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[] { accountId, type, payload, currentUser };

        when(joinPoint.getArgs()).thenReturn(arguments);
        when(organisationAccountOpeningCreateValidator.getType()).thenReturn(type);
        when(accountQueryService.getAccountType(accountId)).thenReturn(AccountType.ORGANISATION);

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
                () -> aspect.process(joinPoint));

        // Verify
        assertThat(businessException.getErrorCode()).isEqualTo(ErrorCode.REQUEST_CREATE_ACTION_NOT_ALLOWED);
        verify(joinPoint, times(1)).getArgs();
        verify(organisationAccountOpeningCreateValidator, times(1)).getType();
    }

    @Test
    void process_account_re_initiate_PU1() {
        final long accountId = 1L;
        final RequestCreateActionType type = RequestCreateActionType.RE_INITIATE_PROGRESS_UPDATE_1_P3;
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId("PU1000001-P3")
                .build();
        final AppUser currentUser = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[] { accountId, type, payload, currentUser };

        when(joinPoint.getArgs()).thenReturn(arguments);
        when(progressUpdate1P3ReInitiateValidator.getType()).thenReturn(type);
        when(accountQueryService.getAccountType(accountId)).thenReturn(AccountType.ORGANISATION);
        when(progressUpdate1P3ReInitiateValidator.validateAction(accountId, payload, currentUser))
                .thenReturn(RequestCreateValidationResult.builder().valid(true).build());

        // Invoke
        aspect.process(joinPoint);

        // Verify
        verify(joinPoint, times(1)).getArgs();
        verify(progressUpdate1P3ReInitiateValidator, times(1)).getType();
        verify(accountQueryService, times(1)).getAccountType(accountId);
        verify(accountQueryService, times(1)).exclusiveLockAccount(accountId);
        verify(progressUpdate1P3ReInitiateValidator, times(1))
                .validateAction(accountId, payload, currentUser);
    }

    @Test
    void process_account_re_initiate_pu1_not_valid() {
        final long accountId = 1L;
        final RequestCreateActionType type = RequestCreateActionType.RE_INITIATE_PROGRESS_UPDATE_1_P3;
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId("PU1000001-P3")
                .build();
        final AppUser currentUser = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[] { accountId, type, payload, currentUser };

        when(joinPoint.getArgs()).thenReturn(arguments);
        when(progressUpdate1P3ReInitiateValidator.getType()).thenReturn(type);
        when(accountQueryService.getAccountType(accountId)).thenReturn(AccountType.ORGANISATION);
        when(progressUpdate1P3ReInitiateValidator.validateAction(accountId, payload, currentUser))
                .thenReturn(RequestCreateValidationResult.builder().valid(false).build());

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
                () -> aspect.process(joinPoint));

        // Verify
        assertThat(businessException.getErrorCode()).isEqualTo(ErrorCode.REQUEST_CREATE_ACTION_NOT_ALLOWED);
        verify(joinPoint, times(1)).getArgs();
        verify(progressUpdate1P3ReInitiateValidator, times(1)).getType();
        verify(accountQueryService, times(1)).getAccountType(accountId);
        verify(accountQueryService, times(1)).exclusiveLockAccount(accountId);
        verify(progressUpdate1P3ReInitiateValidator, times(1))
                .validateAction(accountId, payload, currentUser);
    }

    @Test
    void process_account_re_initiate_PU2() {
        final long accountId = 1L;
        final RequestCreateActionType type = RequestCreateActionType.RE_INITIATE_PROGRESS_UPDATE_2_P3;
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId("PU2000001-P3")
                .build();
        final AppUser currentUser = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[] { accountId, type, payload, currentUser };

        when(joinPoint.getArgs()).thenReturn(arguments);
        when(progressUpdate2P3ReInitiateValidator.getType()).thenReturn(type);
        when(accountQueryService.getAccountType(accountId)).thenReturn(AccountType.ORGANISATION);
        when(progressUpdate2P3ReInitiateValidator.validateAction(accountId, payload, currentUser))
                .thenReturn(RequestCreateValidationResult.builder().valid(true).build());

        // Invoke
        aspect.process(joinPoint);

        // Verify
        verify(joinPoint, times(1)).getArgs();
        verify(progressUpdate2P3ReInitiateValidator, times(1)).getType();
        verify(accountQueryService, times(1)).getAccountType(accountId);
        verify(accountQueryService, times(1)).exclusiveLockAccount(accountId);
        verify(progressUpdate2P3ReInitiateValidator, times(1))
                .validateAction(accountId, payload, currentUser);
    }

    @Test
    void process_account_re_initiate_pu2_not_valid() {
        final long accountId = 1L;
        final RequestCreateActionType type = RequestCreateActionType.RE_INITIATE_PROGRESS_UPDATE_2_P3;
        final ReportRelatedRequestCreateActionPayload payload = ReportRelatedRequestCreateActionPayload.builder()
                .requestId("PU2000001-P3")
                .build();
        final AppUser currentUser = AppUser.builder().userId("userId").build();
        final Object[] arguments = new Object[] { accountId, type, payload, currentUser };

        when(joinPoint.getArgs()).thenReturn(arguments);
        when(progressUpdate2P3ReInitiateValidator.getType()).thenReturn(type);
        when(accountQueryService.getAccountType(accountId)).thenReturn(AccountType.ORGANISATION);
        when(progressUpdate2P3ReInitiateValidator.validateAction(accountId, payload, currentUser))
                .thenReturn(RequestCreateValidationResult.builder().valid(false).build());

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
                () -> aspect.process(joinPoint));

        // Verify
        assertThat(businessException.getErrorCode()).isEqualTo(ErrorCode.REQUEST_CREATE_ACTION_NOT_ALLOWED);
        verify(joinPoint, times(1)).getArgs();
        verify(progressUpdate2P3ReInitiateValidator, times(1)).getType();
        verify(accountQueryService, times(1)).getAccountType(accountId);
        verify(accountQueryService, times(1)).exclusiveLockAccount(accountId);
        verify(progressUpdate2P3ReInitiateValidator, times(1))
                .validateAction(accountId, payload, currentUser);
    }
}
