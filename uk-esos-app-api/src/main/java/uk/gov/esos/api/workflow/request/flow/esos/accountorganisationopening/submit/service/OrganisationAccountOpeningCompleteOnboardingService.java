package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.account.organisation.onboarding.service.OrganisationAccountOnboardingRegistryService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;

@Service
@RequiredArgsConstructor
public class OrganisationAccountOpeningCompleteOnboardingService {

    private final OrganisationAccountOnboardingRegistryService organisationAccountOnboardingRegistryService;
    private final RequestService requestService;

    public void execute(String requestId) {
        Request request = requestService.findRequestById(requestId);

        OrganisationAccountOpeningRequestPayload orgAccOpeningRequestPayload = (OrganisationAccountOpeningRequestPayload) request.getPayload();
        OrganisationAccountPayload accountPayload = orgAccOpeningRequestPayload.getAccount();
        OrganisationParticipantDetails participantDetails = orgAccOpeningRequestPayload.getParticipantDetails();

        organisationAccountOnboardingRegistryService.markAccountOnboardingRegistryAsOnboarded(participantDetails.getEmail(), accountPayload.getRegistrationNumber());
    }
}
