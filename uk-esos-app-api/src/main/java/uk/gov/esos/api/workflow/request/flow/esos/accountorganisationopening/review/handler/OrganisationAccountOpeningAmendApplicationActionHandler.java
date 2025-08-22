package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.handler;

import lombok.RequiredArgsConstructor;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountAmendService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskValidationService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountAmendPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.mapper.OrganisationAccountOpeningReviewMapper;

import java.util.List;

@Component
@RequiredArgsConstructor
public class OrganisationAccountOpeningAmendApplicationActionHandler implements
    RequestTaskActionHandler<OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final OrganisationAccountAmendService organisationAccountAmendService;
    private final RequestTaskValidationService requestTaskValidationService;

    private static final OrganisationAccountOpeningReviewMapper ORGANISATION_ACCOUNT_OPENING_REVIEW_MAPPER = Mappers.getMapper(OrganisationAccountOpeningReviewMapper.class);

    @Override
    public void process(Long requestTaskId, RequestTaskActionType requestTaskActionType, AppUser appUser,
                        OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload taskActionPayload) {
        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        Request request = requestTask.getRequest();

        OrganisationAccountAmendPayload updatedAccountPayload = taskActionPayload.getAccountPayload();
        OrganisationAccountOpeningApplicationRequestTaskPayload taskPayload =
                (OrganisationAccountOpeningApplicationRequestTaskPayload) requestTask.getPayload();
        OrganisationAccountDTO updatedAccountDTO = ORGANISATION_ACCOUNT_OPENING_REVIEW_MAPPER.toAccountOrganisationDTO(
                updatedAccountPayload, taskPayload.getAccount().getRegistrationNumber(), taskPayload.getAccount().getCompetentAuthority());

        // Amend existing account
        organisationAccountAmendService.amendAccount(request.getAccountId(), updatedAccountDTO);

        // Update request task payload
        OrganisationAccountOpeningApplicationRequestTaskPayload requestTaskPayload =
            (OrganisationAccountOpeningApplicationRequestTaskPayload) requestTask.getPayload();
        requestTaskPayload.setAccount(ORGANISATION_ACCOUNT_OPENING_REVIEW_MAPPER.toOrganisationAccountPayload(updatedAccountDTO));

        requestTaskValidationService.validateRequestTaskPayload(requestTaskPayload);
    }

    @Override
    public List<RequestTaskActionType> getTypes() {
        return List.of(RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION);
    }
}
