package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.config.AppProperties;
import uk.gov.esos.api.notification.mail.config.property.NotificationProperties;
import uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants;
import uk.gov.esos.api.notification.mail.domain.EmailData;
import uk.gov.esos.api.notification.mail.service.NotificationEmailService;
import uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOpeningSendCreationEmailServiceTest {

    @InjectMocks
    private OrganisationAccountOpeningSendCreationEmailService sendCreationEmailService;

    @Mock
    private RequestService requestService;

    @Mock
    private NotificationEmailService notificationEmailService;

    @Mock
    private NotificationProperties notificationProperties;

    @Mock
    private AppProperties appProperties;

    @Test
    void sendEmail() {
        String requestId = "1";
        String operatorUserId = "userId";
        String operatorUserEmail = "email";

        OrganisationAccountOpeningRequestPayload requestPayload = OrganisationAccountOpeningRequestPayload.builder()
            .operatorAssignee(operatorUserId)
            .participantDetails(OrganisationParticipantDetails.builder().email(operatorUserEmail).build())
            .build();

        Request request = Request.builder().id(requestId).payload(requestPayload).build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        AppProperties.Web web = mock(AppProperties.Web.class);
        String webUrl = "url";
        when(appProperties.getWeb()).thenReturn(web);
        when(web.getUrl()).thenReturn(webUrl);

        NotificationProperties.Email notificationEmail = mock(NotificationProperties.Email.class);
        String esosHelpdesk = "esosHelpdesk";
        when(notificationProperties.getEmail()).thenReturn(notificationEmail);
        when(notificationEmail.getEsosHelpdesk()).thenReturn(esosHelpdesk);

        //invoke
        sendCreationEmailService.sendEmail(requestId);

        //verify
        ArgumentCaptor<EmailData> recipientEmailCaptor = ArgumentCaptor.forClass(EmailData.class);
        verify(notificationEmailService, times(1)).notifyRecipient(recipientEmailCaptor.capture(), eq(operatorUserEmail));
        //assert email argument
        EmailData emailData = recipientEmailCaptor.getValue();
        assertThat(emailData.getNotificationTemplateData().getTemplateName()).isEqualTo(NotificationTemplateName.ORGANISATION_ACCOUNT_CREATED);
        assertThat(emailData.getNotificationTemplateData().getTemplateParams())
            .containsExactlyInAnyOrderEntriesOf(
                Map.of(
                    EmailNotificationTemplateConstants.HOME_URL, webUrl,
                    EmailNotificationTemplateConstants.ESOS_HELPDESK, esosHelpdesk
                ));

    }

}