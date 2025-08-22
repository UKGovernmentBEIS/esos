package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.config.AppProperties;
import uk.gov.esos.api.notification.mail.config.property.NotificationProperties;
import uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants;
import uk.gov.esos.api.notification.mail.domain.EmailData;
import uk.gov.esos.api.notification.mail.domain.EmailNotificationTemplateData;
import uk.gov.esos.api.notification.mail.service.NotificationEmailService;
import uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrganisationAccountOpeningSendCreationEmailService {

    private final RequestService requestService;
    private final NotificationEmailService notificationEmailService;
    private final NotificationProperties notificationProperties;
    private final AppProperties appProperties;

    public void sendEmail(String requestId) {
        Request request = requestService.findRequestById(requestId);

        OrganisationAccountOpeningRequestPayload requestPayload = (OrganisationAccountOpeningRequestPayload) request.getPayload();
        String assigneeUserEmail = requestPayload.getParticipantDetails().getEmail();

        EmailData emailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(NotificationTemplateName.ORGANISATION_ACCOUNT_CREATED)
                .templateParams(Map.of(
                    EmailNotificationTemplateConstants.HOME_URL, appProperties.getWeb().getUrl(),
                    EmailNotificationTemplateConstants.ESOS_HELPDESK, notificationProperties.getEmail().getEsosHelpdesk()
                ))
                .build())
            .build();

        notificationEmailService.notifyRecipient(emailData, assigneeUserEmail);
    }
}
