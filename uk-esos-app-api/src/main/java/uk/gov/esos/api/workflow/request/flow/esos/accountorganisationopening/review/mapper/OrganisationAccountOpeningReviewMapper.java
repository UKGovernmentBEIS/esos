package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountAmendPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningDecisionSubmittedRequestActionPayload;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface OrganisationAccountOpeningReviewMapper {

    OrganisationAccountDTO toAccountOrganisationDTO(OrganisationAccountAmendPayload accountPayload, String registrationNumber, CompetentAuthorityEnum competentAuthority);

    OrganisationAccountPayload toOrganisationAccountPayload(OrganisationAccountDTO organisationAccountDTO);

    @Mapping(target = "payloadType", expression = "java(uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_PAYLOAD)")
    OrganisationAccountOpeningApplicationRequestTaskPayload toOrganisationAccountOpeningApplicationRequestTaskPayload(OrganisationAccountOpeningRequestPayload accountOpeningRequestPayload);

    @Mapping(target = "payloadType", expression = "java(uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType.ORGANISATION_ACCOUNT_OPENING_DECISION_SUBMITTED_PAYLOAD)")
    OrganisationAccountOpeningDecisionSubmittedRequestActionPayload toOrganisationAccountOpeningDecisionSubmittedRequestActionPayload(OrganisationAccountOpeningRequestPayload requestPayload);
}
