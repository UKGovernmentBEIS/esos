package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.services.resource.AccountAuthorizationResourceService;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateAccountStatusValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateRequestTypeValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateValidatorService;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestMetadata;

import java.time.LocalDateTime;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3ReInitiateValidatorTest {

    @InjectMocks
    private NotificationOfComplianceP3ReInitiateValidator validator;

    @Mock
    private RequestCreateValidatorService requestCreateValidatorService;

    @Mock
    private RequestQueryService requestQueryService;

    @Mock
    private AccountAuthorizationResourceService accountAuthorizationResourceService;

    @Test
    void getType() {
        assertThat(validator.getType()).isEqualTo(RequestCreateActionType.RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3);
    }

    @Test
    void validateAction() {
        final AppUser appUser = AppUser.builder().build();
        final Long accountId = 1L;
        final String requestId = "NOC000001-P3";
        final ReportRelatedRequestCreateActionPayload createActionPayload =
                ReportRelatedRequestCreateActionPayload.builder().requestId(requestId).build();

        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO(requestId, RequestType.NOTIFICATION_OF_COMPLIANCE_P3,
                RequestStatus.COMPLETED, LocalDateTime.now(), NotificationOfComplianceP3RequestMetadata.builder().build());

        when(requestQueryService.findRequestDetailsByIdAndAccountId(requestId, accountId)).thenReturn(requestDetailsDTO);
        when(accountAuthorizationResourceService.hasUserScopeToAccountAndResourceSubType(appUser, accountId, Scope.REQUEST_CREATE, RequestCreateActionType.RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3.name()))
                .thenReturn(true);
        when(requestCreateValidatorService.validateAccountStatuses(accountId, Set.of(OrganisationAccountStatus.LIVE)))
                .thenReturn(RequestCreateAccountStatusValidationResult.builder().valid(true).build());

        // Invoke
        RequestCreateValidationResult result = validator.validateAction(accountId, createActionPayload, appUser);

        // Verify
        assertThat(result.isValid()).isTrue();
        verify(requestQueryService, times(1)).findRequestDetailsByIdAndAccountId(requestId, accountId);
        verify(accountAuthorizationResourceService, times(1))
                .hasUserScopeToAccountAndResourceSubType(appUser, accountId, Scope.REQUEST_CREATE, RequestCreateActionType.RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3.name());
        verify(requestCreateValidatorService, times(1))
                .validateAccountStatuses(accountId, Set.of(OrganisationAccountStatus.LIVE));
    }

    @Test
    void validateAction_account_status_not_valid() {
        final AppUser appUser = AppUser.builder().build();
        final Long accountId = 1L;
        final String requestId = "NOC000001-P3";
        final ReportRelatedRequestCreateActionPayload createActionPayload =
                ReportRelatedRequestCreateActionPayload.builder().requestId(requestId).build();

        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO(requestId, RequestType.NOTIFICATION_OF_COMPLIANCE_P3,
                RequestStatus.COMPLETED, LocalDateTime.now(), NotificationOfComplianceP3RequestMetadata.builder().build());

        when(requestQueryService.findRequestDetailsByIdAndAccountId(requestId, accountId)).thenReturn(requestDetailsDTO);
        when(accountAuthorizationResourceService.hasUserScopeToAccountAndResourceSubType(appUser, accountId, Scope.REQUEST_CREATE, RequestCreateActionType.RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3.name()))
                .thenReturn(true);
        when(requestCreateValidatorService.validateAccountStatuses(accountId, Set.of(OrganisationAccountStatus.LIVE)))
                .thenReturn(RequestCreateAccountStatusValidationResult.builder().valid(false).build());

        // Invoke
        RequestCreateValidationResult result = validator.validateAction(accountId, createActionPayload, appUser);

        // Verify
        assertThat(result.isValid()).isFalse();
        verify(requestQueryService, times(1)).findRequestDetailsByIdAndAccountId(requestId, accountId);
        verify(accountAuthorizationResourceService, times(1))
                .hasUserScopeToAccountAndResourceSubType(appUser, accountId, Scope.REQUEST_CREATE, RequestCreateActionType.RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3.name());
        verify(requestCreateValidatorService, times(1))
                .validateAccountStatuses(accountId, Set.of(OrganisationAccountStatus.LIVE));
    }

    @Test
    void validateAction_permission_not_valid() {
        final AppUser appUser = AppUser.builder().build();
        final Long accountId = 1L;
        final String requestId = "NOC000001-P3";
        final ReportRelatedRequestCreateActionPayload createActionPayload =
                ReportRelatedRequestCreateActionPayload.builder().requestId(requestId).build();

        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO(requestId, RequestType.NOTIFICATION_OF_COMPLIANCE_P3,
                RequestStatus.COMPLETED, LocalDateTime.now(), NotificationOfComplianceP3RequestMetadata.builder().build());

        when(requestQueryService.findRequestDetailsByIdAndAccountId(requestId, accountId)).thenReturn(requestDetailsDTO);
        when(accountAuthorizationResourceService.hasUserScopeToAccountAndResourceSubType(appUser, accountId, Scope.REQUEST_CREATE, RequestCreateActionType.RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3.name()))
                .thenReturn(false);

        // Invoke
        RequestCreateValidationResult result = validator.validateAction(accountId, createActionPayload, appUser);

        // Verify
        assertThat(result.isValid()).isFalse();
        verify(requestQueryService, times(1)).findRequestDetailsByIdAndAccountId(requestId, accountId);
        verify(accountAuthorizationResourceService, times(1))
                .hasUserScopeToAccountAndResourceSubType(appUser, accountId, Scope.REQUEST_CREATE, RequestCreateActionType.RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3.name());
        verifyNoInteractions(requestCreateValidatorService);
    }

    @Test
    void validateAction_request_type_not_valid() {
        final AppUser appUser = AppUser.builder().build();
        final Long accountId = 1L;
        final String requestId = "NOC000001-P3";
        final ReportRelatedRequestCreateActionPayload createActionPayload =
                ReportRelatedRequestCreateActionPayload.builder().requestId(requestId).build();

        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO(requestId, RequestType.ORGANISATION_ACCOUNT_OPENING,
                RequestStatus.COMPLETED, LocalDateTime.now(), NotificationOfComplianceP3RequestMetadata.builder().build());

        when(requestQueryService.findRequestDetailsByIdAndAccountId(requestId, accountId)).thenReturn(requestDetailsDTO);

        // Invoke
        RequestCreateValidationResult result = validator.validateAction(accountId, createActionPayload, appUser);

        assertThat(result.isValid()).isFalse();

        // Verify
        verify(requestQueryService, times(1)).findRequestDetailsByIdAndAccountId(requestId, accountId);
    }

    @Test
    void validateRequestType() {
        final Long accountId = 1L;
        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO("NOC000001-P3", RequestType.NOTIFICATION_OF_COMPLIANCE_P3,
                RequestStatus.COMPLETED, LocalDateTime.now(), NotificationOfComplianceP3RequestMetadata.builder().build());

        // Invoke
        RequestCreateRequestTypeValidationResult result = validator.validateRequestType(accountId, requestDetailsDTO);

        // Verify
        assertThat(result.isValid()).isTrue();
    }

    @Test
    void validateRequestType_not_valid() {
        final Long accountId = 1L;
        final RequestDetailsDTO requestDetailsDTO = new RequestDetailsDTO("NOC000001-P3", RequestType.NOTIFICATION_OF_COMPLIANCE_P3,
                RequestStatus.IN_PROGRESS, LocalDateTime.now(), NotificationOfComplianceP3RequestMetadata.builder().build());

        // Invoke
        RequestCreateRequestTypeValidationResult result = validator.validateRequestType(accountId, requestDetailsDTO);

        // Verify
        assertThat(result.isValid()).isFalse();
    }

    @Test
    void getApplicableAccountStatuses() {
        assertThat(validator.getApplicableAccountStatuses()).containsExactly(OrganisationAccountStatus.LIVE);
    }

    @Test
    void getReferableRequestType() {
        assertThat(validator.getReferableRequestType()).isEqualTo(RequestType.NOTIFICATION_OF_COMPLIANCE_P3);
    }
}
