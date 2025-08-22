package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.account.organisation.onboarding.service.OrganisationAccountOnboardingRegistryService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOpeningCompleteOnboardingServiceTest {

    @InjectMocks
    private OrganisationAccountOpeningCompleteOnboardingService completeOnboardingService;

    @Mock
    private OrganisationAccountOnboardingRegistryService organisationAccountOnboardingRegistryService;

    @Mock
    private RequestService requestService;

    @Test
    void execute() {
        String requestId = "1";
        String registrationNumber = "regNbr";
        String email = "user@esos.uk";

        OrganisationAccountPayload accountPayload = OrganisationAccountPayload.builder()
            .registrationNumber(registrationNumber)
            .build();

        OrganisationParticipantDetails participantDetails = OrganisationParticipantDetails.builder()
            .email(email)
            .build();

        final Request request = Request.builder()
            .id(requestId)
            .payload(OrganisationAccountOpeningRequestPayload.builder()
                .payloadType(RequestPayloadType.ORGANISATION_ACCOUNT_OPENING_REQUEST_PAYLOAD)
                .account(accountPayload)
                .participantDetails(participantDetails)
                .build())
            .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        //invoke
        completeOnboardingService.execute(requestId);

        //verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(organisationAccountOnboardingRegistryService, times(1))
            .markAccountOnboardingRegistryAsOnboarded(email, registrationNumber);
    }
}