package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountQueryService;
import uk.gov.esos.api.authorization.core.domain.Authority;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityRoleDTO;
import uk.gov.esos.api.authorization.core.repository.AuthorityRepository;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityQueryService;
import uk.gov.esos.api.notification.mail.config.property.NotificationProperties;
import uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants;
import uk.gov.esos.api.notification.mail.domain.EmailData;
import uk.gov.esos.api.notification.mail.domain.EmailNotificationTemplateData;
import uk.gov.esos.api.notification.mail.service.NotificationEmailService;
import uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.service.OperatorUserManagementService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureApplicationRequestTaskPayload;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccountClosureEmailService {

    private final NotificationEmailService notificationEmailService;
    private final NotificationProperties notificationProperties;

    private final OperatorUserManagementService operatorUserManagementService;

    private final OrganisationAccountQueryService organisationAccountQueryService;

    private final OperatorAuthorityQueryService operatorAuthorityQueryService;


    public void sendEmail(RequestTask requestTask) {

        Request request = requestTask.getRequest();

        AccountClosureApplicationRequestTaskPayload taskPayload =
                (AccountClosureApplicationRequestTaskPayload) requestTask.getPayload();

        String justification = taskPayload.getAccountClosure().getReason();

        List<AuthorityRoleDTO> operatorUsers = operatorAuthorityQueryService.findOperatorUserAuthoritiesListByAccount(request.getAccountId());

        OrganisationAccountDTO account = organisationAccountQueryService.getOrganisationAccountById(request.getAccountId());

        EmailData emailData = EmailData.builder()
                .notificationTemplateData(EmailNotificationTemplateData.builder()
                        .templateName(NotificationTemplateName.ACCOUNT_CLOSED)
                        .templateParams(Map.of(
                                EmailNotificationTemplateConstants.ACCOUNT_NAME, account.getName(),
                                EmailNotificationTemplateConstants.ACCOUNT_ID, account.getOrganisationId(),
                                EmailNotificationTemplateConstants.ACCOUNT_CLOSURE_JUSTIFICATION, justification,
                                EmailNotificationTemplateConstants.ESOS_HELPDESK, notificationProperties.getEmail().getEsosHelpdesk()
                        ))
                        .build())
                .build();

        for(AuthorityRoleDTO operUser : operatorUsers){
            OperatorUserDTO userDTO = operatorUserManagementService.getOperatorUserByAccountAndId(request.getAccountId(),operUser.getUserId());
            notificationEmailService.notifyRecipient(emailData, userDTO.getEmail());
        }
    }
}
