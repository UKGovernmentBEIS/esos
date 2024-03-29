package uk.gov.esos.api.notification.template.domain.converter;

import jakarta.persistence.AttributeConverter;
import uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName;

/**
 * Converts NotificationTemplateName value into string and back again.
 */
public class NotificationTemplateNameConverter implements AttributeConverter<NotificationTemplateName, String> {

    @Override
    public String convertToDatabaseColumn(NotificationTemplateName notificationTemplateName) {
        return notificationTemplateName.getName();
    }

    @Override
    public NotificationTemplateName convertToEntityAttribute(String dbData) {
        return NotificationTemplateName.getEnumValueFromName(dbData);
    }
}
