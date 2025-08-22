package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.account.organisation.onboarding.service.OrganisationAccountOnboardingRegistryQueryService;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountCreateService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.StartProcessRequestService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.service.OrganisationAccountDetailsQueryService;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestCreateActionHandler;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.domain.OrganisationAccountOpeningSubmitApplicationCreateActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.mapper.OrganisationAccountOpeningSubmitMapper;

import java.util.Map;

import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType.ORGANISATION_ACCOUNT_OPENING;

@Component
@RequiredArgsConstructor
public class OrganisationAccountOpeningSubmitApplicationCreateActionHandler implements RequestCreateActionHandler<OrganisationAccountOpeningSubmitApplicationCreateActionPayload> {

    private final StartProcessRequestService startProcessRequestService;
    private final RequestService requestService;
    private final OrganisationAccountCreateService organisationAccountCreateService;
    private final OrganisationAccountDetailsQueryService organisationAccountDetailsQueryService;
    
    private final OrganisationAccountOnboardingRegistryQueryService organisationAccountOnboardingRegistryQueryService;
    private static final OrganisationAccountOpeningSubmitMapper ORGANISATION_ACCOUNT_OPENING_SUBMIT_MAPPER = Mappers.getMapper(OrganisationAccountOpeningSubmitMapper.class);

    @Override
    public String process(final Long accountId,
                          final RequestCreateActionType type,
                          final OrganisationAccountOpeningSubmitApplicationCreateActionPayload payload,
                          final AppUser appUser) {

        final OrganisationAccountPayload accountPayload = payload.getAccountPayload();
        final OrganisationParticipantDetails participantDetails = organisationAccountDetailsQueryService
                .getOrganisationParticipantDetails(appUser.getUserId());

        boolean registrationNumberExists = organisationAccountOnboardingRegistryQueryService
        		.existsByEmailAndRegistrationNumber(appUser.getEmail(), accountPayload.getRegistrationNumber());

        OrganisationAccountDTO accountDTO = ORGANISATION_ACCOUNT_OPENING_SUBMIT_MAPPER.toAccountOrganisationDTO(accountPayload);

        accountDTO = organisationAccountCreateService.createOrganisationAccount(accountDTO);

        Request request = startProcessRequestService.startProcess(
                RequestParams.builder()
                        .type(ORGANISATION_ACCOUNT_OPENING)
                        .accountId(accountDTO.getId())
                        .requestPayload(ORGANISATION_ACCOUNT_OPENING_SUBMIT_MAPPER
                                .toOrganisationAccountOpeningRequestPayload(accountPayload, participantDetails, appUser.getUserId()))
                        .processVars(Map.of(BpmnProcessConstants.EXISTS_VERIFIED_REGISTRATION_NUMBER, registrationNumberExists))
                        .build()
        );

        // Set request's submission date
        request.setSubmissionDate(request.getCreationDate());

        // Create request action
        requestService.addActionToRequest(
                request,
                ORGANISATION_ACCOUNT_OPENING_SUBMIT_MAPPER
                        .toOrganisationAccountOpeningApplicationSubmittedRequestActionPayload(accountPayload, participantDetails),
                        registrationNumberExists ? RequestActionType.ORGANISATION_ACCOUNT_OPENING_CREATED : RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED,
                appUser.getUserId());

        return request.getId();
    }

    public RequestCreateActionType getType() {
        return RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION;
    }

}
