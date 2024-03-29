package uk.gov.esos.api.notification.template.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.notification.template.domain.NotificationContent;
import uk.gov.esos.api.notification.template.domain.NotificationTemplate;
import uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName;
import uk.gov.esos.api.notification.template.repository.NotificationTemplateRepository;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName.EMAIL_CONFIRMATION;

@ExtendWith(MockitoExtension.class)
class NotificationTemplateProcessServiceTest {

    private static final String TEMPLATE_SUBJECT = "template ${subjectVar}";
    private static final String TEMPLATE_TEXT = "template ${textVar}";

    private static final Map<String, Object> DATA_MODEL_PARAMS = Map.of(
        "subjectVar", "subject",
        "textVar", "text");

    @InjectMocks
    private NotificationTemplateProcessService service;

    @Mock
    private NotificationTemplateRepository notificationTemplateRepository;

    @Test
    void processMessageNotificationTemplate() {
        final NotificationTemplateName templateName = EMAIL_CONFIRMATION;
        final String subject = "template subject";
        final String text = "template text";
        NotificationTemplate notificationTemplate = buildMockNotificationTemplate(templateName, null);
        NotificationContent expectedNotificationContent = NotificationContent.builder().subject(subject).text(text).build();

        when(notificationTemplateRepository.findByNameAndCompetentAuthorityAndAccountType(templateName, null, null))
            .thenReturn(Optional.of(notificationTemplate));

        NotificationContent actualNotificationContent =
            service.processMessageNotificationTemplate(notificationTemplate.getName(), DATA_MODEL_PARAMS);

        assertEquals(expectedNotificationContent, actualNotificationContent);
    }

    @Test
    void processEmailNotificationTemplate_with_CA() {
        final NotificationTemplateName templateName = EMAIL_CONFIRMATION;
        CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        AccountType accountType = AccountType.ORGANISATION;
        final String subject = "template subject";
        final String text = "<p>template text</p>\n";
        NotificationTemplate notificationTemplate = buildMockNotificationTemplate(templateName, ca);
        NotificationContent expectedNotificationContent = NotificationContent.builder().subject(subject).text(text).build();

        when(notificationTemplateRepository.findByNameAndCompetentAuthorityAndAccountType(templateName, ca, accountType))
            .thenReturn(Optional.of(notificationTemplate));

        NotificationContent actualNotificationContent =
            service.processEmailNotificationTemplate(notificationTemplate.getName(), ca, accountType, DATA_MODEL_PARAMS);

        assertEquals(expectedNotificationContent, actualNotificationContent);
    }

    private NotificationTemplate buildMockNotificationTemplate(NotificationTemplateName templateName, CompetentAuthorityEnum competentAuthority) {
        NotificationTemplate notificationTemplate = new NotificationTemplate();
        notificationTemplate.setName(templateName);
        notificationTemplate.setCompetentAuthority(competentAuthority);
        notificationTemplate.setSubject(TEMPLATE_SUBJECT);
        notificationTemplate.setText(TEMPLATE_TEXT);
        return notificationTemplate;
    }
}