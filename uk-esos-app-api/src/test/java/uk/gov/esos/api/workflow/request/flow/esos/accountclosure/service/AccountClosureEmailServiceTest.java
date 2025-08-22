package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountQueryService;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityRoleDTO;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityQueryService;
import uk.gov.esos.api.notification.mail.config.property.NotificationProperties;
import uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants;
import uk.gov.esos.api.notification.mail.domain.EmailData;
import uk.gov.esos.api.notification.mail.service.NotificationEmailService;
import uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.service.OperatorUserManagementService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosure;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureRequestPayload;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountClosureEmailServiceTest {

    @Mock
    private NotificationEmailService notificationEmailService;

    @Mock
    private OperatorUserManagementService operatorUserManagementService;

    @Mock
    private OperatorAuthorityQueryService operatorAuthorityQueryService;

    @Mock
    private OrganisationAccountQueryService organisationAccountQueryService;

    @InjectMocks
    private AccountClosureEmailService accountClosureEmailService;

    @Mock
    private NotificationProperties notificationProperties;

    @Test
    void sendEmail_shouldSendNotificationsToAllOperatorUsers() {
        String requestId = "1";
        String operatorUserId = "userId";
        String operatorUser1Id = "userId1";
        Long accountId = 1L;

        AccountClosureRequestPayload requestPayload = AccountClosureRequestPayload.builder()
                .operatorAssignee(operatorUserId)
                .build();

        Request request = Request.builder().id(requestId).payload(requestPayload).accountId(accountId).build();

        AuthorityRoleDTO user = new AuthorityRoleDTO();
        user.setUserId(operatorUserId);

        AuthorityRoleDTO user1 = new AuthorityRoleDTO();
        user1.setUserId(operatorUser1Id);

        List<AuthorityRoleDTO> operatorUsers = new ArrayList<>();
        operatorUsers.add(user);
        operatorUsers.add(user1);

        OrganisationAccountDTO account = new OrganisationAccountDTO();
        account.setName("test name");
        account.setOrganisationId("test org id");

        OperatorUserDTO userDTO = new OperatorUserDTO();
        userDTO.setEmail("test@hotmail.com");

        OperatorUserDTO userDTO1 = new OperatorUserDTO();
        userDTO1.setEmail("test1@hotmail.com");

        RequestTask requestTask = RequestTask.builder()
                .type(RequestTaskType.ACCOUNT_CLOSURE_SUBMIT)
                .request(request)
                .payload(AccountClosureApplicationRequestTaskPayload.builder().accountClosure(new AccountClosure("a reason"))
                        .payloadType(RequestTaskPayloadType.ACCOUNT_CLOSURE_APPLICATION_SUBMIT_PAYLOAD)
                        .build())
                .build();

        NotificationProperties.Email notificationEmail = mock(NotificationProperties.Email.class);
        String esosHelpdesk = "esosHelpdesk";
        when(notificationProperties.getEmail()).thenReturn(notificationEmail);
        when(notificationEmail.getEsosHelpdesk()).thenReturn(esosHelpdesk);

        when(operatorAuthorityQueryService.findOperatorUserAuthoritiesListByAccount(accountId)).thenReturn(operatorUsers);
        when(organisationAccountQueryService.getOrganisationAccountById(accountId)).thenReturn(account);

        when(operatorUserManagementService.getOperatorUserByAccountAndId(accountId, operatorUserId)).thenReturn(userDTO);
        when(operatorUserManagementService.getOperatorUserByAccountAndId(accountId, operatorUser1Id)).thenReturn(userDTO1);

        //invoke
        accountClosureEmailService.sendEmail(requestTask);

        ArgumentCaptor<EmailData> recipientEmailCaptor = ArgumentCaptor.forClass(EmailData.class);
        ArgumentCaptor<EmailData> recipientEmailCaptor1 = ArgumentCaptor.forClass(EmailData.class);

        verify(notificationEmailService, times(1)).notifyRecipient(recipientEmailCaptor.capture(), eq("test@hotmail.com"));
        verify(notificationEmailService, times(1)).notifyRecipient(recipientEmailCaptor1.capture(), eq("test1@hotmail.com"));
        //assert email argument
        EmailData emailData = recipientEmailCaptor.getValue();
        assertThat(emailData.getNotificationTemplateData().getTemplateName()).isEqualTo(NotificationTemplateName.ACCOUNT_CLOSED);
        assertThat(emailData.getNotificationTemplateData().getTemplateParams())
                .containsExactlyInAnyOrderEntriesOf(
                        Map.of(
                                EmailNotificationTemplateConstants.ESOS_HELPDESK, esosHelpdesk,
                                EmailNotificationTemplateConstants.ACCOUNT_NAME, "test name",
                                EmailNotificationTemplateConstants.ACCOUNT_ID, "test org id",
                                EmailNotificationTemplateConstants.ACCOUNT_CLOSURE_JUSTIFICATION, "a reason"
                        ));
    }
}