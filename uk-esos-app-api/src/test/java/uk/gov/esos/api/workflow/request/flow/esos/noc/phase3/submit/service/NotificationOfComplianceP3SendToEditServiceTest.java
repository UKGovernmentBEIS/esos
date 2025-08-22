package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.contactpersons.ContactPersons;
import uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure.OrganisationAssociatedWithRU;
import uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure.OrganisationStructure;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ResponsibleUndertaking;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.dto.AccountOriginatedData;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.domain.NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.mapper.NotificationOfComplianceP3Mapper;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3SendToEditServiceTest {

    @InjectMocks
    private NotificationOfComplianceP3SendToEditService sendToEditService;

    @Mock
    private RequestService requestService;

    @Mock
    private NotificationOfComplianceP3Mapper notificationOfComplianceP3Mapper;


    @Test
    void applySendToEditAction() {

        final AppUser appUser = AppUser.builder().userId("userId").build();
        NotificationOfComplianceP3RequestPayload requestPayload = NotificationOfComplianceP3RequestPayload.builder()
                .payloadType(RequestPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_REQUEST_PAYLOAD)
                .build();
        Request request = Request.builder()
                .type(RequestType.NOTIFICATION_OF_COMPLIANCE_P3)
                .payload(requestPayload)
                .build();

        final OrganisationAssociatedWithRU organisationAssociatedWithRU = OrganisationAssociatedWithRU.builder()
                .registrationNumberExist(Boolean.TRUE)
                .registrationNumber("registration number")
                .organisationName("organisation name")
                .isPartOfFranchise(Boolean.TRUE)
                .isParentOfResponsibleUndertaking(Boolean.FALSE)
                .isSubsidiaryOfResponsibleUndertaking(Boolean.TRUE)
                .build();

        final OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .organisationsAssociatedWithRU(Set.of(organisationAssociatedWithRU))
                .build();

        final ContactPersons contactPersons = ContactPersons.builder()
                .primaryContact(ContactPerson.builder()
                        .firstName("first name")
                        .lastName("last name")
                        .email("email@email.com")
                        .jobTitle("job title")
                        .phoneNumber(PhoneNumberDTO.builder()
                                .countryCode("GR")
                                .number("number")
                                .build())
                        .address(CountyAddressDTO.builder()
                                .line1("line1")
                                .city("city")
                                .county("country")
                                .postcode("postcode")
                                .build())
                        .build())
                .hasSecondaryContact(Boolean.TRUE)
                .secondaryContact(ContactPerson.builder()
                        .firstName("second first name")
                        .lastName("second last name")
                        .email("email2@email.gr")
                        .jobTitle("second job title")
                        .phoneNumber(PhoneNumberDTO.builder()
                                .countryCode("GR")
                                .number("phone number")
                                .build())
                        .build())
                .build();

        NocP3 noc = NocP3.builder()
                .responsibleUndertaking(ResponsibleUndertaking.builder().build())
                .organisationStructure(organisationStructure)
                .contactPersons(contactPersons)
                .build();
        Map<String, String> sectionsCompleted = Map.of("section", "false");
        Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "attachment");
        final AccountOriginatedData accountOriginatedData = AccountOriginatedData.builder()
                .organisationDetails(OrganisationDetails.builder()
                        .name("organisation name")
                        .registrationNumber("registration number")
                        .build())
                .primaryContact(ContactPerson.builder()
                        .firstName("first name")
                        .lastName("last name")
                        .build())
                .secondaryContact(ContactPerson.builder()
                        .firstName("second first name")
                        .lastName("second last name")
                        .build())
                .build();

        NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload requestTaskPayload =
                NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload.builder()
                        .noc(noc)
                        .nocSectionsCompleted(sectionsCompleted)
                        .nocAttachments(attachments)
                        .accountOriginatedData(accountOriginatedData)
                        .build();
        RequestTask requestTask = RequestTask.builder()
                .request(request)
                .payload(requestTaskPayload)
                .build();
        String selectedAssignee = "assignee";

        final NotificationOfComplianceP3ApplicationRequestActionPayload submittedActionPayload = NotificationOfComplianceP3ApplicationRequestActionPayload.builder()
                .payloadType(RequestActionPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT_PAYLOAD)
                .noc(noc)
                .accountOriginatedData(accountOriginatedData)
                .nocAttachments(attachments)
                .build();

        when(notificationOfComplianceP3Mapper
                .toNotificationOfComplianceP3ApplicationRequestActionPayload(requestTaskPayload, RequestActionPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT_PAYLOAD))
                .thenReturn(submittedActionPayload);

        sendToEditService.applySendToEditAction(requestTask, selectedAssignee, appUser);

        assertEquals(noc, requestPayload.getNoc());
        assertThat(requestPayload.getNocAttachments()).containsExactlyInAnyOrderEntriesOf(attachments);
        assertThat(requestPayload.getNocSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(sectionsCompleted);
        assertEquals(selectedAssignee, requestPayload.getSupportingOperator());
        assertThat(((NotificationOfComplianceP3RequestPayload) request.getPayload()).getAccountOriginatedData())
                .isEqualTo(accountOriginatedData);

        verify(notificationOfComplianceP3Mapper, times(1))
                .toNotificationOfComplianceP3ApplicationRequestActionPayload(requestTaskPayload, RequestActionPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT_PAYLOAD);
        verify(requestService, times(1)).addActionToRequest(
                request, submittedActionPayload, RequestActionType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT, appUser.getUserId());
    }
}