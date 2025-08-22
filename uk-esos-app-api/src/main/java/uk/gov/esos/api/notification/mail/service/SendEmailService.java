package uk.gov.esos.api.notification.mail.service;

import uk.gov.esos.api.notification.mail.domain.Email;

/**
 * Service for sending mails.
 */
public interface SendEmailService {

    /**
     * Sends an email with the parameters provided in the Mail object.
     * @param email {@link Email}
     */
    void sendMail(Email email);
    
}
