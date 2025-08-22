package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.transform;

import org.mapstruct.Mapper;

import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface NotificationOfComplianceP3SubmitMapper {

    ContactPerson toContactPerson(OrganisationParticipantDetails organisationParticipantDetails);

    NocP3Container toNocP3Container(NotificationOfComplianceP3RequestPayload requestPayload, Phase phase);
}
