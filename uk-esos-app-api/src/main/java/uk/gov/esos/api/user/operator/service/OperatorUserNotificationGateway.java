package uk.gov.esos.api.user.operator.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.dto.RoleDTO;
import uk.gov.esos.api.authorization.core.service.RoleService;
import uk.gov.esos.api.authorization.operator.domain.NewUserActivated;
import uk.gov.esos.api.common.config.AppProperties;
import uk.gov.esos.api.notification.mail.config.property.NotificationProperties;
import uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants;
import uk.gov.esos.api.notification.mail.domain.EmailData;
import uk.gov.esos.api.notification.mail.domain.EmailNotificationTemplateData;
import uk.gov.esos.api.notification.mail.service.NotificationEmailService;
import uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName;
import uk.gov.esos.api.token.JwtTokenActionEnum;
import uk.gov.esos.api.user.NavigationOutcomes;
import uk.gov.esos.api.token.JwtProperties;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.domain.model.UserNotificationWithRedirectionLinkInfo;
import uk.gov.esos.api.user.core.service.UserNotificationService;
import uk.gov.esos.api.user.operator.domain.OperatorUserAcceptInvitationDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserInvitationDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName.INVITEE_INVITATION_ACCEPTED;
import static uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName.INVITER_INVITATION_ACCEPTED;
import static uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName.USER_ACCOUNT_CREATED;

@Log4j2
@Service
@RequiredArgsConstructor
public class OperatorUserNotificationGateway {

    private final RoleService roleService;
    private final NotificationEmailService notificationEmailService;
    private final UserNotificationService userNotificationService;
    private final NotificationProperties notificationProperties;
    private final JwtProperties jwtProperties;
    private final AppProperties appProperties;

    /**
     * Sends an {@link NotificationTemplateName#INVITATION_TO_OPERATOR_ACCOUNT} email with receiver email param as recipient.
     * @param operatorUserInvitationDTO the invited operator user to notify
     * @param accountName the account name that will be used to form the email body
     * @param authorityUuid the uuid that will be used to form the token that will be send with the email body
     */
    public void notifyInvitedUser(OperatorUserInvitationDTO operatorUserInvitationDTO, String accountName,
                                  String authorityUuid) {
        RoleDTO roleDTO = roleService.getRoleByCode(operatorUserInvitationDTO.getRoleCode());
        long expirationInMinutes = jwtProperties.getClaim().getUserInvitationExpIntervalMinutes();

        Map<String, Object> notificationParams = new HashMap<>(Map.of(
                EmailNotificationTemplateConstants.USER_ROLE_TYPE, roleDTO.getName(),
                EmailNotificationTemplateConstants.ACCOUNT_NAME, accountName,
                EmailNotificationTemplateConstants.EXPIRATION_MINUTES, expirationInMinutes,
                EmailNotificationTemplateConstants.ESOS_HELPDESK, notificationProperties.getEmail().getEsosHelpdesk()
        ));

        userNotificationService.notifyUserWithLink(
                UserNotificationWithRedirectionLinkInfo.builder()
                        .templateName(NotificationTemplateName.INVITATION_TO_OPERATOR_ACCOUNT)
                        .userEmail(operatorUserInvitationDTO.getEmail())
                        .notificationParams(notificationParams)
                        .linkParamName(EmailNotificationTemplateConstants.OPERATOR_INVITATION_CONFIRMATION_LINK)
                        .linkPath(NavigationOutcomes.OPERATOR_REGISTRATION_INVITATION_ACCEPTED_URL)
                        .tokenParams(UserNotificationWithRedirectionLinkInfo.TokenParams.builder()
                                .jwtTokenAction(JwtTokenActionEnum.OPERATOR_INVITATION)
                                .claimValue(authorityUuid)
                                .expirationInterval(expirationInMinutes)
                                .build()
                        )
                        .build()
        );
    }
    
    public void notifyRegisteredUser(OperatorUserDTO operatorUserDTO) {
        EmailData emailInfo = EmailData.builder()
                .notificationTemplateData(EmailNotificationTemplateData.builder()
                        .templateName(USER_ACCOUNT_CREATED)
                        .templateParams(Map.of(
                                EmailNotificationTemplateConstants.USER_ACCOUNT_CREATED_USER_EMAIL, operatorUserDTO.getEmail(),
                                EmailNotificationTemplateConstants.ESOS_HELPDESK, notificationProperties.getEmail().getEsosHelpdesk()))
                        .build())
                .build();

        notificationEmailService.notifyRecipient(emailInfo, operatorUserDTO.getEmail());
    }

    public void notifyEmailVerification(String email) {
        Map<String, Object> notificationParams = new HashMap<>();
        notificationParams.put(EmailNotificationTemplateConstants.ESOS_HELPDESK,
                notificationProperties.getEmail().getEsosHelpdesk());

        userNotificationService.notifyUserWithLink(
                UserNotificationWithRedirectionLinkInfo.builder()
                        .templateName(NotificationTemplateName.EMAIL_CONFIRMATION)
                        .notificationParams(notificationParams)
                        .userEmail(email)
                        .linkParamName(EmailNotificationTemplateConstants.EMAIL_CONFIRMATION_LINK)
                        .linkPath(NavigationOutcomes.REGISTRATION_EMAIL_VERIFY_CONFIRMATION_URL)
                        .tokenParams(UserNotificationWithRedirectionLinkInfo.TokenParams.builder()
                                .jwtTokenAction(JwtTokenActionEnum.USER_REGISTRATION)
                                .claimValue(email)
                                .expirationInterval(jwtProperties.getClaim().getUserInvitationExpIntervalMinutes())
                                .build()
                        )
                        .build()
        );
    }

    public void notifyInviteeAcceptedInvitation(OperatorUserAcceptInvitationDTO invitee) {
        EmailData inviteeInfo = EmailData.builder()
                .notificationTemplateData(EmailNotificationTemplateData.builder()
                        .templateName(INVITEE_INVITATION_ACCEPTED)
                        .templateParams(Map.of(EmailNotificationTemplateConstants.USER_ROLE_TYPE, "Operator",
                                EmailNotificationTemplateConstants.ESOS_HELPDESK, notificationProperties.getEmail().getEsosHelpdesk(),
                                EmailNotificationTemplateConstants.HOME_URL, appProperties.getWeb().getUrl()))
                        .build())
                .build();

        notificationEmailService.notifyRecipient(inviteeInfo, invitee.getEmail());
    }

    public void notifyInviterAcceptedInvitation(OperatorUserAcceptInvitationDTO invitee, UserInfoDTO inviter) {
        EmailData inviteeInfo = EmailData.builder()
                .notificationTemplateData(EmailNotificationTemplateData.builder()
                        .templateName(INVITER_INVITATION_ACCEPTED)
                        .templateParams(Map.of(
                                EmailNotificationTemplateConstants.USER_ACCOUNT_CREATED_USER_FNAME, inviter.getFirstName(),
                                EmailNotificationTemplateConstants.USER_ACCOUNT_CREATED_USER_LNAME, inviter.getLastName(),
                                EmailNotificationTemplateConstants.USER_INVITEE_FNAME, invitee.getFirstName(),
                                EmailNotificationTemplateConstants.USER_INVITEE_LNAME, invitee.getLastName(),
                                EmailNotificationTemplateConstants.ESOS_HELPDESK, notificationProperties.getEmail().getEsosHelpdesk()))
                        .build())
                .build();

        notificationEmailService.notifyRecipient(inviteeInfo, inviter.getEmail());
    }

    public void notifyUsersUpdateStatus(List<NewUserActivated> activatedOperators) {
        activatedOperators.forEach(user -> {
            try{
            	RoleDTO roleDTO = roleService.getRoleByCode(user.getRoleCode());
                userNotificationService.notifyUserAccountActivation(user.getUserId(), roleDTO.getName());
            } catch (Exception ex){
                log.error("Exception during sending email for update operator status:", ex);
            }
        });
    }
}
