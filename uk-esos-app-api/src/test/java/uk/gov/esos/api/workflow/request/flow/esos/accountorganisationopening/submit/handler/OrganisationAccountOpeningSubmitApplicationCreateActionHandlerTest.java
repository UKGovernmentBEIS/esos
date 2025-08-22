package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.account.organisation.onboarding.service.OrganisationAccountOnboardingRegistryQueryService;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountCreateService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.ClassificationType;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.StartProcessRequestService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.service.OrganisationAccountDetailsQueryService;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.domain.OrganisationAccountOpeningApplicationSubmittedRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.domain.OrganisationAccountOpeningSubmitApplicationCreateActionPayload;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType.ORGANISATION_ACCOUNT_OPENING;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOpeningSubmitApplicationCreateActionHandlerTest {

    @InjectMocks
    private OrganisationAccountOpeningSubmitApplicationCreateActionHandler handler;

    @Mock
    private RequestService requestService;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Mock
    private OrganisationAccountCreateService organisationAccountCreateService;

    @Mock
    private OrganisationAccountDetailsQueryService organisationAccountDetailsQueryService;

    @Mock
    private OrganisationAccountOnboardingRegistryQueryService accountOnboardingRegistryQueryService;

    @Test
    void process_new_organisation_account_no_verified_registration_number() {
        final String userId = "userId";
        final String userEmail = "user@esos.uk";
        final AppUser appUser = AppUser.builder().userId(userId).email(userEmail).build();
        final long accountId = 1L;
        final String registrationNumber = "regNumber";

        CountyAddressDTO addressDTO = CountyAddressDTO.builder()
                .line1("line1")
                .line2("line2")
                .city("city")
                .county("county")
                .postcode("postcode")
                .build();
        
        ClassificationCodes codes = ClassificationCodes.builder()
		        .type(ClassificationType.OTHER)
		        .otherTypeName("NACE")
		        .codes(List.of("code1", "code2"))
		        .build();

        OrganisationAccountPayload organisationAccountPayload = OrganisationAccountPayload.builder()
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .name("name")
                .registrationNumber(registrationNumber)
                .codes(codes)
                .address(addressDTO)
                .build();

        OrganisationParticipantDetails participantDetails = OrganisationParticipantDetails.builder()
                .firstName("FirstName")
                .email(userEmail)
                .build();

        OrganisationAccountOpeningSubmitApplicationCreateActionPayload createActionPayload =
                OrganisationAccountOpeningSubmitApplicationCreateActionPayload.builder()
                        .accountPayload(organisationAccountPayload)
                        .payloadType(RequestCreateActionPayloadType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION_PAYLOAD)
                        .build();


        OrganisationAccountOpeningApplicationSubmittedRequestActionPayload accountSubmittedPayload =
                OrganisationAccountOpeningApplicationSubmittedRequestActionPayload.builder()
                        .payloadType(RequestActionPayloadType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED_PAYLOAD)
                        .participantDetails(participantDetails)
                        .account(organisationAccountPayload)
                        .build();

        OrganisationAccountOpeningRequestPayload requestPayload = OrganisationAccountOpeningRequestPayload.builder()
                .payloadType(RequestPayloadType.ORGANISATION_ACCOUNT_OPENING_REQUEST_PAYLOAD)
                .participantDetails(participantDetails)
                .account(organisationAccountPayload)
                .operatorAssignee(appUser.getUserId())
                .build();


        OrganisationAccountDTO accountDTO = OrganisationAccountDTO.builder()
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .registrationNumber(registrationNumber)
                .address(addressDTO)
                .name("name")
                .codes(ClassificationCodes.builder()
                		.type(ClassificationType.OTHER)
                		.otherTypeName("NACE")
        		        .codes(List.of("code1", "code2"))
        		        .build())
                .build();

        OrganisationAccountDTO persistedAccountDTO = OrganisationAccountDTO.builder()
                .id(accountId)
                .organisationId("orgId")
                .status(OrganisationAccountStatus.LIVE)
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .registrationNumber(registrationNumber)
                .address(addressDTO)
                .name("name")
                .codes(ClassificationCodes.builder()
                		.type(ClassificationType.OTHER)
                		.otherTypeName("NACE")
        		        .codes(List.of("code1", "code2"))
        		        .build())
                .build();

        RequestParams requestParams = RequestParams.builder()
            .type(ORGANISATION_ACCOUNT_OPENING)
            .accountId(1L)
            .requestPayload(requestPayload)
            .processVars(Map.of(BpmnProcessConstants.EXISTS_VERIFIED_REGISTRATION_NUMBER, false))
            .build();

        Request request = Request.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).creationDate(LocalDateTime.now()).build();

        when(organisationAccountCreateService.createOrganisationAccount(accountDTO)).thenReturn(persistedAccountDTO);
        when(startProcessRequestService.startProcess(requestParams)).thenReturn(request);
        when(organisationAccountDetailsQueryService.getOrganisationParticipantDetails(userId)).thenReturn(participantDetails);
        when(accountOnboardingRegistryQueryService.existsByEmailAndRegistrationNumber(userEmail, registrationNumber))
        	.thenReturn(false);

        // Invoke
        handler.process(null, RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION, createActionPayload, appUser);

        // Assertions and verifications
        assertThat(request.getSubmissionDate()).isEqualTo(request.getCreationDate());
        verify(organisationAccountCreateService, times(1)).createOrganisationAccount(accountDTO);
        verify(startProcessRequestService, times(1)).startProcess(requestParams);
        verify(organisationAccountDetailsQueryService, times(1)).getOrganisationParticipantDetails(userId);
        verify(accountOnboardingRegistryQueryService, times(1))
        	.existsByEmailAndRegistrationNumber(userEmail, registrationNumber);
        verify(requestService, times(1))
            .addActionToRequest(request,
                accountSubmittedPayload,
                RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED,
                appUser.getUserId());
    }

    @Test
    void process_new_organisation_account_with_verified_registration_number() {
        final String userId = "userId";
        final String userEmail = "user@esos.uk";
        final AppUser appUser = AppUser.builder().userId(userId).email(userEmail).build();
        final long accountId = 1L;
        final String registrationNumber = "regNumber";

        CountyAddressDTO addressDTO = CountyAddressDTO.builder()
            .line1("line1")
            .line2("line2")
            .city("city")
            .county("county")
            .postcode("postcode")
            .build();

        OrganisationAccountPayload organisationAccountPayload = OrganisationAccountPayload.builder()
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .name("name")
            .registrationNumber(registrationNumber)
            .address(addressDTO)
            .build();

        OrganisationParticipantDetails participantDetails = OrganisationParticipantDetails.builder()
            .firstName("FirstName")
            .email(userEmail)
            .build();

        OrganisationAccountOpeningSubmitApplicationCreateActionPayload createActionPayload =
            OrganisationAccountOpeningSubmitApplicationCreateActionPayload.builder()
                .accountPayload(organisationAccountPayload)
                .payloadType(RequestCreateActionPayloadType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION_PAYLOAD)
                .build();


        OrganisationAccountOpeningApplicationSubmittedRequestActionPayload accountSubmittedPayload =
            OrganisationAccountOpeningApplicationSubmittedRequestActionPayload.builder()
                .payloadType(RequestActionPayloadType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED_PAYLOAD)
                .participantDetails(participantDetails)
                .account(organisationAccountPayload)
                .build();

        OrganisationAccountOpeningRequestPayload requestPayload = OrganisationAccountOpeningRequestPayload.builder()
            .payloadType(RequestPayloadType.ORGANISATION_ACCOUNT_OPENING_REQUEST_PAYLOAD)
            .participantDetails(participantDetails)
            .account(organisationAccountPayload)
            .operatorAssignee(appUser.getUserId())
            .build();


        OrganisationAccountDTO accountDTO = OrganisationAccountDTO.builder()
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .registrationNumber(registrationNumber)
            .address(addressDTO)
            .name("name")
            .build();

        OrganisationAccountDTO persistedAccountDTO = OrganisationAccountDTO.builder()
            .id(accountId)
            .organisationId("orgId")
            .status(OrganisationAccountStatus.LIVE)
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .registrationNumber(registrationNumber)
            .address(addressDTO)
            .name("name")
            .build();

        RequestParams requestParams = RequestParams.builder()
            .type(ORGANISATION_ACCOUNT_OPENING)
            .accountId(1L)
            .requestPayload(requestPayload)
            .processVars(Map.of(BpmnProcessConstants.EXISTS_VERIFIED_REGISTRATION_NUMBER, true))
            .build();

        Request request = Request.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).creationDate(LocalDateTime.now()).build();

        when(organisationAccountCreateService.createOrganisationAccount(accountDTO)).thenReturn(persistedAccountDTO);
        when(startProcessRequestService.startProcess(requestParams)).thenReturn(request);
        when(organisationAccountDetailsQueryService.getOrganisationParticipantDetails(userId)).thenReturn(participantDetails);
        when(accountOnboardingRegistryQueryService.existsByEmailAndRegistrationNumber(userEmail, registrationNumber))
        	.thenReturn(true);

        // Invoke
        handler.process(null, RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION, createActionPayload, appUser);

        // Assertions and verifications
        assertThat(request.getSubmissionDate()).isEqualTo(request.getCreationDate());
        verify(organisationAccountCreateService, times(1)).createOrganisationAccount(accountDTO);
        verify(startProcessRequestService, times(1)).startProcess(requestParams);
        verify(organisationAccountDetailsQueryService, times(1)).getOrganisationParticipantDetails(userId);
        verify(accountOnboardingRegistryQueryService, times(1))
        	.existsByEmailAndRegistrationNumber(userEmail, registrationNumber);
        verify(requestService, times(1))
            .addActionToRequest(request,
                accountSubmittedPayload,
                RequestActionType.ORGANISATION_ACCOUNT_OPENING_CREATED,
                appUser.getUserId());
    }

}
