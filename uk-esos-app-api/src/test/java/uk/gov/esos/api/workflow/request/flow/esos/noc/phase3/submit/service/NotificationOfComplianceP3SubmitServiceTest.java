package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.ClassificationType;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.common.domain.NocSubmitParams;
import uk.gov.esos.api.reporting.noc.common.service.NocService;
import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationEnergyResponsibilityType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationQualificationReasonType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationQualificationType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligationDetails;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ResponsibleUndertaking;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ReviewOrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.dto.AccountOriginatedData;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.domain.NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3SubmitServiceTest {

    @InjectMocks
    private NotificationOfComplianceP3SubmitService nocP3SubmitService;

    @Mock
    private NocService nocService;

    @Test
    void submitNocAction() {
        Map<String, String> nocSectionsCompleted = Map.of("section", "completed");
        Map<UUID, String> nocAttachments = Map.of(UUID.randomUUID(), "attachment1");
        NocP3 noc = NocP3.builder()
            .reportingObligation(ReportingObligation.builder()
                .qualificationType(OrganisationQualificationType.QUALIFY)
                .reportingObligationDetails(ReportingObligationDetails.builder()
                    .qualificationReasonType(OrganisationQualificationReasonType.STAFF_MEMBERS_MORE_THAN_250)
                    .energyResponsibilityType(OrganisationEnergyResponsibilityType.NOT_RESPONSIBLE)
                    .build())
                .build())
            .responsibleUndertaking(ResponsibleUndertaking.builder()
                .organisationDetails(ReviewOrganisationDetails.builder()
                    .name("Organisation name")
                    .build())
                .build())
            .build();
        Long accountId = 1L;
        Request request = Request.builder()
            .type(RequestType.NOTIFICATION_OF_COMPLIANCE_P3)
            .payload(NotificationOfComplianceP3RequestPayload.builder()
                .payloadType(RequestPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_REQUEST_PAYLOAD)
                .noc(NocP3.builder().build())
                .build())
            .accountId(accountId)
            .build();
        AccountOriginatedData accountOriginatedData = AccountOriginatedData.builder()
                .organisationDetails(OrganisationDetails.builder()
                        .name("name")
                        .registrationNumber("12345678")
                        .address(CountyAddressDTO.builder()
                                .line1("line1")
                                .city("city")
                                .postcode("25100")
                                .county("county")
                                .build())
                        .codes(ClassificationCodes.builder()
                                .type(ClassificationType.SIC)
                                .codes(List.of("code1"))
                                .build())
                        .build())
                .primaryContact(ContactPerson.builder()
                        .firstName("Fname")
                        .lastName("Lname")
                        .email("email@email.com")
                        .phoneNumber(PhoneNumberDTO.builder()
                                .countryCode("30")
                                .number("12345678")
                                .build())
                        .jobTitle("job")
                        .build())
                .build();
        RequestTask requestTask = RequestTask.builder()
            .type(RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT)
            .request(request)
            .payload(NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload.builder()
                .payloadType(RequestTaskPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT_PAYLOAD)
                .noc(noc)
                .nocAttachments(nocAttachments)
                .nocSectionsCompleted(nocSectionsCompleted)
                .accountOriginatedData(accountOriginatedData)
                .build())
            .build();

        NocSubmitParams nocSubmitParams = NocSubmitParams.builder()
            .accountId(accountId)
            .nocContainer(NocP3Container.builder().phase(Phase.PHASE_3).noc(noc).nocAttachments(nocAttachments).build())
            .build();

        // Invoke
        nocP3SubmitService.submitNocAction(requestTask);

        // Verify
        assertThat(request.getPayload()).isInstanceOf(NotificationOfComplianceP3RequestPayload.class);
        assertThat(((NotificationOfComplianceP3RequestPayload) request.getPayload()).getNocSectionsCompleted())
            .isEqualTo(nocSectionsCompleted);
        assertThat(((NotificationOfComplianceP3RequestPayload) request.getPayload()).getNocAttachments())
            .isEqualTo(nocAttachments);
        assertThat(((NotificationOfComplianceP3RequestPayload) request.getPayload()).getNoc())
            .isEqualTo(noc);
        assertThat(((NotificationOfComplianceP3RequestPayload) request.getPayload()).getAccountOriginatedData())
                .isEqualTo(accountOriginatedData);

        verify(nocService, times(1)).submitNoc(nocSubmitParams);
    }
}