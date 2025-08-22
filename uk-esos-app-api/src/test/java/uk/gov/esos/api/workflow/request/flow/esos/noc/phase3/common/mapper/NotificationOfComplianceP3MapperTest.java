package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.mapper;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.ClassificationType;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.contactpersons.ContactPersons;
import uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure.OrganisationAssociatedWithRU;
import uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure.OrganisationStructure;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ComplianceRouteDistribution;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationEnergyResponsibilityType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationQualificationReasonType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationQualificationType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligationDetails;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.OrganisationContactDetails;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ResponsibleUndertaking;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ReviewOrganisationDetails;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.TradingDetails;
import uk.gov.esos.api.workflow.request.core.domain.dto.AccountOriginatedData;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestTaskPayload;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class NotificationOfComplianceP3MapperTest {

    private final NotificationOfComplianceP3Mapper mapper = Mappers.getMapper(NotificationOfComplianceP3Mapper.class);

    @Test
    void toNotificationOfComplianceP3ApplicationRequestActionPayload_with_task_payload_as_source() {

        final RequestActionPayloadType requestActionPayloadType = RequestActionPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT_PAYLOAD;

        final ContactPerson contactPerson = ContactPerson.builder()
                .firstName("first name")
                .lastName("last name")
                .email("email")
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .county("country")
                        .city("city")
                        .postcode("postcode")
                        .build())
                .phoneNumber(PhoneNumberDTO.builder()
                        .countryCode("GR")
                        .number("12345")
                        .build())
                .build();

        final ContactPerson secondaryContact = ContactPerson.builder()
                .firstName("secondary contact first name")
                .lastName("secondary contact last name")
                .email("secondary contact email")
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .county("country")
                        .city("city")
                        .postcode("postcode")
                        .build())
                .phoneNumber(PhoneNumberDTO.builder()
                        .countryCode("GR")
                        .number("13579")
                        .build())
                .build();

        final OrganisationDetails organisationDetails = OrganisationDetails.builder().build();

        final AccountOriginatedData accountOriginatedData = AccountOriginatedData.builder()
                .organisationDetails(organisationDetails)
                .primaryContact(contactPerson)
                .secondaryContact(secondaryContact)
                .build();

        final UUID uuid = UUID.randomUUID();
        final Map<UUID, String> nocAttachments = Map.of(uuid, "attachment");

        final NocP3 noc = NocP3.builder()
                .reportingObligation(ReportingObligation.builder()
                        .qualificationType(OrganisationQualificationType.QUALIFY)
                        .reportingObligationDetails(ReportingObligationDetails.builder()
                                .energyResponsibilityType(OrganisationEnergyResponsibilityType.RESPONSIBLE)
                                .complianceRouteDistribution(ComplianceRouteDistribution.builder()
                                        .iso50001Pct(10)
                                        .displayEnergyCertificatePct(20)
                                        .greenDealAssessmentPct(20)
                                        .energyAuditsPct(40)
                                        .energyNotAuditedPct(10)
                                        .totalPct(100)
                                        .build())
                                .qualificationReasonType(OrganisationQualificationReasonType.STAFF_MEMBERS_MORE_THAN_250)
                                .build())
                        .build())
                .organisationStructure(OrganisationStructure.builder()
                        .isHighestParent(Boolean.FALSE)
                        .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                                .registrationNumberExist(Boolean.TRUE)
                                .registrationNumber("registration number")
                                .organisationName("organisation name")
                                .isSubsidiaryOfResponsibleUndertaking(Boolean.TRUE)
                                .isParentOfResponsibleUndertaking(Boolean.FALSE)
                                .isPartOfFranchise(Boolean.TRUE)
                                .hasCeasedToBePartOfGroup(Boolean.TRUE)
                                .isPartOfArrangement(Boolean.FALSE)
                                .build()))
                        .build())
                .contactPersons(ContactPersons.builder()
                        .primaryContact(contactPerson)
                        .hasSecondaryContact(Boolean.FALSE)
                        .build())
                .responsibleUndertaking(ResponsibleUndertaking.builder()
                        .organisationDetails(ReviewOrganisationDetails.builder()
                                .name("review organisation details name")
                                .registrationNumberExist(Boolean.TRUE)
                                .registrationNumber("registration number")
                                .address(CountyAddressDTO.builder()
                                        .line1("line1")
                                        .county("country")
                                        .city("city")
                                        .postcode("postcode")
                                        .build())
                                .codes(ClassificationCodes.builder()
                                        .type(ClassificationType.SIC)
                                        .codes(List.of("code 1"))
                                        .build())
                                .build())
                        .tradingDetails(TradingDetails.builder()
                                .exist(Boolean.TRUE)
                                .tradingName("trading name")
                                .build())
                        .organisationContactDetails(OrganisationContactDetails.builder()
                                .email("email")
                                .phoneNumber(PhoneNumberDTO.builder()
                                        .countryCode("GR")
                                        .number("45678")
                                        .build())
                                .build())
                        .isBehalfOfTrust(Boolean.FALSE)
                        .hasOverseasParentDetails(Boolean.FALSE)
                        .build())
                .build();

        final NotificationOfComplianceP3ApplicationRequestTaskPayload taskPayload = NotificationOfComplianceP3ApplicationRequestTaskPayload.builder()
                .accountOriginatedData(accountOriginatedData)
                .nocAttachments(nocAttachments)
                .noc(noc)
                .build();

        final NotificationOfComplianceP3ApplicationRequestActionPayload expected = NotificationOfComplianceP3ApplicationRequestActionPayload.builder()
                .payloadType(requestActionPayloadType)
                .noc(noc)
                .nocAttachments(nocAttachments)
                .accountOriginatedData(accountOriginatedData)
                .build();

        final NotificationOfComplianceP3ApplicationRequestActionPayload actual =
                mapper.toNotificationOfComplianceP3ApplicationRequestActionPayload(taskPayload, requestActionPayloadType);

        assertThat(actual)
                .isInstanceOf(NotificationOfComplianceP3ApplicationRequestActionPayload.class)
                .isEqualTo(expected);
    }

    @Test
    void toNotificationOfComplianceP3ApplicationRequestActionPayload_with_request_payload_as_source() {

        final RequestActionPayloadType requestActionPayloadType = RequestActionPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED_PAYLOAD;

        final Map<UUID, String> nocAttachments = Map.of(UUID.randomUUID(), "attachment");

        final NocP3 noc = NocP3.builder()
            .reportingObligation(ReportingObligation.builder()
                .qualificationType(OrganisationQualificationType.QUALIFY)
                .reportingObligationDetails(ReportingObligationDetails.builder()
                    .energyResponsibilityType(OrganisationEnergyResponsibilityType.RESPONSIBLE)
                    .complianceRouteDistribution(ComplianceRouteDistribution.builder()
                        .iso50001Pct(10)
                        .displayEnergyCertificatePct(20)
                        .greenDealAssessmentPct(20)
                        .energyAuditsPct(40)
                        .energyNotAuditedPct(10)
                        .totalPct(100)
                        .build())
                    .qualificationReasonType(OrganisationQualificationReasonType.STAFF_MEMBERS_MORE_THAN_250)
                    .build())
                .build())
            .organisationStructure(OrganisationStructure.builder()
                    .isHighestParent(Boolean.FALSE)
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                    .registrationNumberExist(Boolean.TRUE)
                    .registrationNumber("registration number")
                    .organisationName("organisation name")
                    .isSubsidiaryOfResponsibleUndertaking(Boolean.TRUE)
                    .isParentOfResponsibleUndertaking(Boolean.FALSE)
                    .isPartOfFranchise(Boolean.TRUE)
                    .hasCeasedToBePartOfGroup(Boolean.TRUE)
                    .isPartOfArrangement(Boolean.FALSE)
                    .build()))
                .build())
            .build();

        final NotificationOfComplianceP3RequestPayload requestPayload = NotificationOfComplianceP3RequestPayload.builder()
            .noc(noc)
            .nocAttachments(nocAttachments)
            .build();

        final NotificationOfComplianceP3ApplicationRequestActionPayload expected = NotificationOfComplianceP3ApplicationRequestActionPayload.builder()
            .payloadType(requestActionPayloadType)
            .noc(noc)
            .nocAttachments(nocAttachments)
            .build();

        final NotificationOfComplianceP3ApplicationRequestActionPayload actual =
            mapper.toNotificationOfComplianceP3ApplicationRequestActionPayload(requestPayload, requestActionPayloadType);

        assertThat(actual)
            .isInstanceOf(NotificationOfComplianceP3ApplicationRequestActionPayload.class)
            .isEqualTo(expected);
    }
}
