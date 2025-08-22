package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.transform;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationQualificationType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

class NotificationOfComplianceP3SubmitMapperTest {

    private final NotificationOfComplianceP3SubmitMapper mapper = Mappers.getMapper(NotificationOfComplianceP3SubmitMapper.class);

    @Test
    void toContactPerson() {
        OrganisationParticipantDetails participantDetails = OrganisationParticipantDetails.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .jobTitle("Job")
                .email("fname@email.uk")
                .phoneNumber(PhoneNumberDTO.builder()
                        .countryCode("30")
                        .number("2101313131")
                        .build())
                .mobileNumber(PhoneNumberDTO.builder()
                        .countryCode("30")
                        .number("2102323231")
                        .build())
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .build();

        ContactPerson expected = ContactPerson.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .jobTitle("Job")
                .email("fname@email.uk")
                .phoneNumber(PhoneNumberDTO.builder()
                        .countryCode("30")
                        .number("2101313131")
                        .build())
                .mobileNumber(PhoneNumberDTO.builder()
                        .countryCode("30")
                        .number("2102323231")
                        .build())
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .build();

        // Invoke
        ContactPerson actual = mapper.toContactPerson(participantDetails);

        // Verify
        assertThat(actual)
                .isInstanceOf(ContactPerson.class)
                .isEqualTo(expected);
    }

    @Test
    void toNocP3Container() {
        Phase phase = Phase.PHASE_3;
        NocP3 noc = NocP3.builder()
            .reportingObligation(ReportingObligation.builder()
                    .qualificationType(OrganisationQualificationType.NOT_QUALIFY)
                    .noQualificationReason("reason")
                    .build())
            .build();

        NotificationOfComplianceP3RequestPayload requestPayload =
            NotificationOfComplianceP3RequestPayload.builder()
                .noc(noc)
                .build();

        NocP3Container expected = NocP3Container.builder().noc(noc).phase(phase).build();

        NocP3Container actual = mapper.toNocP3Container(requestPayload, phase);

        assertEquals(expected, actual);
    }
}
