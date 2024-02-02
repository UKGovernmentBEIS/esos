package uk.gov.esos.api.workflow.request.flow.payment.service;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Date;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.common.constants.ExpirationReminderType;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestExpirationReminderService;
import uk.gov.esos.api.workflow.request.flow.common.service.notification.NotificationTemplateExpirationReminderParams;
import uk.gov.esos.api.workflow.request.flow.common.service.notification.NotificationTemplateWorkflowTaskType;

@ExtendWith(MockitoExtension.class)
class PaymentSendReminderNotificationServiceTest {

    @InjectMocks
    private PaymentSendReminderNotificationService service;

    @Mock
    private RequestService requestService;
    
    @Mock
    private RequestAccountContactQueryService requestAccountContactQueryService;
    
    @Mock
    private RequestExpirationReminderService requestExpirationReminderService;
    
    @Test
    void sendFirstReminderNotification() {
        String requestId = "1";
        Date deadline = new Date();
        
        Request request = Request.builder().id(requestId)
                .type(RequestType.ORGANISATION_ACCOUNT_OPENING)
                .build();
        
        UserInfoDTO accountPrimaryContact = UserInfoDTO.builder().firstName("fn").lastName("ln").email("email@email").build();
        
        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
            .thenReturn(Optional.of(accountPrimaryContact));
        
        // invoke
        service.sendFirstReminderNotification(requestId, deadline);
        
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1)).getRequestAccountPrimaryContact(request);
        verify(requestExpirationReminderService, times(1)).sendExpirationReminderNotification(requestId, 
                NotificationTemplateExpirationReminderParams
                .builder()
                .workflowTask(NotificationTemplateWorkflowTaskType.PAYMENT.getDescription())
                .recipient(accountPrimaryContact)
                .expirationTime(ExpirationReminderType.FIRST_REMINDER.getDescription())
                .expirationTimeLong(ExpirationReminderType.FIRST_REMINDER.getDescriptionLong())
                .deadline(deadline)
                .build()
               );
    }
    
    @Test
    void sendSecondReminderNotification() {
        String requestId = "1";
        Date deadline = new Date();
        
        Request request = Request.builder().id(requestId)
                .type(RequestType.ORGANISATION_ACCOUNT_OPENING)
                .build();
        
        UserInfoDTO accountPrimaryContact = UserInfoDTO.builder().firstName("fn").lastName("ln").email("email@email").build();
        
        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
            .thenReturn(Optional.of(accountPrimaryContact));
        
        // invoke
        service.sendSecondReminderNotification(requestId, deadline);
        
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1)).getRequestAccountPrimaryContact(request);
        verify(requestExpirationReminderService, times(1)).sendExpirationReminderNotification(requestId, 
                NotificationTemplateExpirationReminderParams
                .builder()
                .workflowTask(NotificationTemplateWorkflowTaskType.PAYMENT.getDescription())
                .recipient(accountPrimaryContact)
                .expirationTime(ExpirationReminderType.SECOND_REMINDER.getDescription())
                .expirationTimeLong(ExpirationReminderType.SECOND_REMINDER.getDescriptionLong())
                .deadline(deadline)
                .build()
               );
    }
}
