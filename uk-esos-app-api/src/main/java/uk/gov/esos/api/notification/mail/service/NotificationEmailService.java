package uk.gov.esos.api.notification.mail.service;

import uk.gov.esos.api.notification.mail.domain.Email;
import uk.gov.esos.api.notification.mail.domain.EmailData;

import java.util.List;

/**
 * Service for generating mail objects.
 */
public interface NotificationEmailService {

    /**
     * Generates an {@link Email} object that will be sent to the service responsible for sending emails,
     * using the provided information and auto-sender application property as sender.
     * @param emailData {@link EmailData}
     * @param recipientEmail
     */
    void notifyRecipient(EmailData emailData, String recipientEmail);
    
    void notifyRecipients(EmailData emailData, List<String> recipientsEmails, List<String> ccRecipientsEmails);
    
}
