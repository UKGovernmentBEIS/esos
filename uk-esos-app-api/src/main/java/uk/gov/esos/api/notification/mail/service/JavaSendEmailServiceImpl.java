package uk.gov.esos.api.notification.mail.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailParseException;
import org.springframework.mail.MailPreparationException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.retry.annotation.Retryable;
import org.springframework.retry.support.RetrySynchronizationManager;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.notification.mail.domain.Email;

import java.util.Map;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Log4j2
@Service
@RequiredArgsConstructor
public class JavaSendEmailServiceImpl implements SendEmailService {

    private final JavaMailSender mailSender;

    @Override
    @Retryable(retryFor = { MailSendException.class },
    	maxAttemptsExpression = "${email.max-retries}",
    	backoff = @Backoff(delayExpression = "${email.batch.delay}"))
    public void sendMail(Email email) {
        log.info("Sending mail with subject {} to: {}. Retry number: {}", email::getSubject,
            () -> String.join(",", email.getSendTo()), RetrySynchronizationManager.getContext()::getRetryCount);

        try {
        	MimeMessage message = mailSender.createMimeMessage();
    		MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);

    		messageHelper.setFrom(email.getSendFrom());
    		messageHelper.setTo(email.getSendTo().toArray(String[]::new));
    		messageHelper.setCc(email.getSendCc().toArray(String[]::new));
    		messageHelper.setSubject(email.getSubject());
    		messageHelper.setText(email.getText(), true);
    		
    		for(Map.Entry<String, byte[]> attachment : email.getAttachments().entrySet()) {
    		    messageHelper.addAttachment(attachment.getKey(), new ByteArrayResource(attachment.getValue()));    
    		}

    		mailSender.send(message);
        } catch (MailAuthenticationException | 
        		 MessagingException |
        		 MailParseException |
        		 MailPreparationException ex) {
            log.error("Exception during creation of email with subject {} to: {}", 
            		email.getSubject(), email.getSendTo(), ex);
        }
    }
    
    @Recover
    public void recover(MailSendException mse, Email email) {
    	log.error("Exception during sending email with subject {} to: {}", 
        		email.getSubject(), email.getSendTo(), mse);      
    }

}
