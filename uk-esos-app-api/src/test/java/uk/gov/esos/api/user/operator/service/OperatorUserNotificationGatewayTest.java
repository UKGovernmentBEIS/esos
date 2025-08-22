package uk.gov.esos.api.user.operator.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.AuthorityConstants;
import uk.gov.esos.api.authorization.core.domain.dto.RoleDTO;
import uk.gov.esos.api.authorization.core.service.RoleService;
import uk.gov.esos.api.authorization.operator.domain.NewUserActivated;
import uk.gov.esos.api.common.config.AppProperties;
import uk.gov.esos.api.notification.mail.config.property.NotificationProperties;
import uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants;
import uk.gov.esos.api.notification.mail.domain.EmailData;
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

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants.EMAIL_CONFIRMATION_LINK;
import static uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants.USER_ROLE_TYPE;
import static uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName.EMAIL_CONFIRMATION;
import static uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName.INVITATION_TO_OPERATOR_ACCOUNT;

@ExtendWith(MockitoExtension.class)
class OperatorUserNotificationGatewayTest {

    @InjectMocks
    private OperatorUserNotificationGateway operatorUserNotificationGateway;

    @Mock
    private RoleService roleService;

    @Mock
    private NotificationEmailService notificationEmailService;

    @Mock
    private UserNotificationService userNotificationService;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private NotificationProperties notificationProperties;

    @Mock
    private JwtProperties jwtProperties;
    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private AppProperties appProperties;


    @Test
    void notifyInvitedUser() {
        String receiverEmail = "receiverEmail";
        String roleCode = "roleCode";
        String accountName = "accountName";
        String authorityUuid = "authorityUuid";
        String roleName = "roleName";
        String esosHelpdesk = "helpdesk";
        RoleDTO roleDTO = RoleDTO.builder().code(roleCode).name(roleName).build();

        OperatorUserInvitationDTO operatorUserInvitationDTO =
            OperatorUserInvitationDTO
                .builder()
                .email(receiverEmail)
                .roleCode(roleCode)
                .build();

        JwtProperties.Claim claim = mock(JwtProperties.Claim.class);
        long expirationInterval = 60L;

        when(roleService.getRoleByCode(roleCode)).thenReturn(roleDTO);
        when(jwtProperties.getClaim()).thenReturn(claim);
        when(notificationProperties.getEmail().getEsosHelpdesk()).thenReturn(esosHelpdesk);

        when(claim.getUserInvitationExpIntervalMinutes()).thenReturn(expirationInterval);

        operatorUserNotificationGateway.notifyInvitedUser(operatorUserInvitationDTO, accountName, authorityUuid);

        verify(roleService , times(1)).getRoleByCode(roleCode);

        ArgumentCaptor<UserNotificationWithRedirectionLinkInfo> notificationInfoCaptor =
            ArgumentCaptor.forClass(UserNotificationWithRedirectionLinkInfo.class);
        verify(userNotificationService, times(1)).notifyUserWithLink(notificationInfoCaptor.capture());

        UserNotificationWithRedirectionLinkInfo notificationInfo = notificationInfoCaptor.getValue();

        assertThat(notificationInfo.getTemplateName()).isEqualTo(INVITATION_TO_OPERATOR_ACCOUNT);
        assertThat(notificationInfo.getUserEmail()).isEqualTo(operatorUserInvitationDTO.getEmail());
        assertThat(notificationInfo.getLinkParamName()).isEqualTo(EmailNotificationTemplateConstants.OPERATOR_INVITATION_CONFIRMATION_LINK);
        assertThat(notificationInfo.getLinkPath()).isEqualTo(NavigationOutcomes.OPERATOR_REGISTRATION_INVITATION_ACCEPTED_URL);
        assertThat(notificationInfo.getNotificationParams()).containsExactlyInAnyOrderEntriesOf(
            Map.of(
                    USER_ROLE_TYPE, roleDTO.getName(),
                    EmailNotificationTemplateConstants.ACCOUNT_NAME, accountName,
                    EmailNotificationTemplateConstants.EXPIRATION_MINUTES, 60L,
                    EmailNotificationTemplateConstants.ESOS_HELPDESK, esosHelpdesk
            ));
        assertThat(notificationInfo.getTokenParams())
            .isEqualTo(expectedInvitationLinkTokenParams(JwtTokenActionEnum.OPERATOR_INVITATION, authorityUuid, expirationInterval));

    }

    @Test
    void notifyRegisteredUser() {
        String esosHelpdesk = "helpdesk";
        OperatorUserDTO operatorUserDTO =
            OperatorUserDTO.builder().firstName("fn").lastName("ln").email("email").build();

        NotificationProperties.Email notificationEmail = mock(NotificationProperties.Email.class);
        when(notificationProperties.getEmail()).thenReturn(notificationEmail);
        when(notificationEmail.getEsosHelpdesk()).thenReturn(esosHelpdesk);

        operatorUserNotificationGateway.notifyRegisteredUser(operatorUserDTO);

        //verify
        ArgumentCaptor<EmailData> emailInfoCaptor = ArgumentCaptor.forClass(EmailData.class);
        verify(notificationEmailService, times(1)).notifyRecipient(emailInfoCaptor.capture(), Mockito.eq(operatorUserDTO.getEmail()));

        EmailData emailInfo = emailInfoCaptor.getValue();
        assertThat(emailInfo.getNotificationTemplateData().getTemplateName()).isEqualTo(NotificationTemplateName.USER_ACCOUNT_CREATED);

        assertThat(emailInfo.getNotificationTemplateData().getTemplateParams()).containsExactlyInAnyOrderEntriesOf(
            Map.of(
                EmailNotificationTemplateConstants.USER_ACCOUNT_CREATED_USER_EMAIL, operatorUserDTO.getEmail(),
                EmailNotificationTemplateConstants.ESOS_HELPDESK, esosHelpdesk
            ));
    }

    @Test
    void notifyEmailVerification() {
        String email = "email";
        String esosHelpdesk = "esosHelpdesk";
        JwtProperties.Claim claim = mock(JwtProperties.Claim.class);
        long expirationInterval = 10L;

        when(jwtProperties.getClaim()).thenReturn(claim);
        when(claim.getUserInvitationExpIntervalMinutes()).thenReturn(expirationInterval);

        NotificationProperties.Email notificationEmail = mock(NotificationProperties.Email.class);
        when(notificationProperties.getEmail()).thenReturn(notificationEmail);
        when(notificationEmail.getEsosHelpdesk()).thenReturn(esosHelpdesk);

        operatorUserNotificationGateway.notifyEmailVerification("email");

        //verify
        ArgumentCaptor<UserNotificationWithRedirectionLinkInfo> notificationInfoCaptor =
            ArgumentCaptor.forClass(UserNotificationWithRedirectionLinkInfo.class);
        verify(userNotificationService, times(1)).notifyUserWithLink(notificationInfoCaptor.capture());

        UserNotificationWithRedirectionLinkInfo notificationInfo = notificationInfoCaptor.getValue();

        assertThat(notificationInfo.getTemplateName()).isEqualTo(EMAIL_CONFIRMATION);
        assertThat(notificationInfo.getUserEmail()).isEqualTo(email);
        assertThat(notificationInfo.getLinkParamName()).isEqualTo(EMAIL_CONFIRMATION_LINK);
        assertThat(notificationInfo.getLinkPath()).isEqualTo(NavigationOutcomes.REGISTRATION_EMAIL_VERIFY_CONFIRMATION_URL);
        assertThat(notificationInfo.getNotificationParams())
                .isEqualTo(Map.of(EmailNotificationTemplateConstants.ESOS_HELPDESK, esosHelpdesk));
        assertThat(notificationInfo.getTokenParams())
            .isEqualTo(expectedInvitationLinkTokenParams(JwtTokenActionEnum.USER_REGISTRATION, email, expirationInterval));
    }

    @Test
    void notifyInviteeAcceptedInvitation() {
    	String esosHelpdesk = "esosHelpdesk";
        OperatorUserAcceptInvitationDTO operatorUserAcceptInvitation = OperatorUserAcceptInvitationDTO.builder()
            .firstName("firstName")
            .lastName("lastName")
            .email("email")
            .accountInstallationName("accountInstallationName")
            .build();

        when(notificationProperties.getEmail().getEsosHelpdesk()).thenReturn(esosHelpdesk);
        when(appProperties.getWeb().getUrl()).thenReturn("url");

        operatorUserNotificationGateway.notifyInviteeAcceptedInvitation(operatorUserAcceptInvitation);

        //verify
        ArgumentCaptor<EmailData> emailInfoCaptor = ArgumentCaptor.forClass(EmailData.class);
        verify(notificationEmailService, times(1)).notifyRecipient(emailInfoCaptor.capture(), Mockito.eq(operatorUserAcceptInvitation.getEmail()));

        EmailData emailInfo = emailInfoCaptor.getValue();
        assertThat(emailInfo.getNotificationTemplateData().getTemplateName()).isEqualTo(NotificationTemplateName.INVITEE_INVITATION_ACCEPTED);
        assertThat(emailInfo.getNotificationTemplateData().getTemplateParams()).containsExactlyInAnyOrderEntriesOf(
            Map.of(USER_ROLE_TYPE, "Operator",
                    EmailNotificationTemplateConstants.ESOS_HELPDESK, esosHelpdesk,
                    EmailNotificationTemplateConstants.HOME_URL, "url")
        );
    }

    @Test
    void notifyInviterAcceptedInvitation() {
    	String esosHelpdesk = "esosHelpdesk";
        OperatorUserAcceptInvitationDTO invitee = OperatorUserAcceptInvitationDTO.builder()
                .firstName("inviteeName")
                .lastName("inviteeLastName")
                .email("inviteeEmail")
                .accountInstallationName("accountInstallationName")
                .build();
        UserInfoDTO inviter =  UserInfoDTO.builder()
                .firstName("inviterName")
                .lastName("inviterLastName")
                .email("inviterEmail")
                .build();

        when(notificationProperties.getEmail().getEsosHelpdesk()).thenReturn(esosHelpdesk);
        
        operatorUserNotificationGateway.notifyInviterAcceptedInvitation(invitee, inviter);

        //verify
        ArgumentCaptor<EmailData> emailInfoCaptor = ArgumentCaptor.forClass(EmailData.class);
        verify(notificationEmailService, times(1)).notifyRecipient(emailInfoCaptor.capture(), Mockito.eq(inviter.getEmail()));

        EmailData emailInfo = emailInfoCaptor.getValue();
        assertThat(emailInfo.getNotificationTemplateData().getTemplateName()).isEqualTo(NotificationTemplateName.INVITER_INVITATION_ACCEPTED);
        assertThat(emailInfo.getNotificationTemplateData().getTemplateParams()).containsExactlyInAnyOrderEntriesOf(Map.of(
                EmailNotificationTemplateConstants.USER_ACCOUNT_CREATED_USER_FNAME, inviter.getFirstName(),
                EmailNotificationTemplateConstants.USER_ACCOUNT_CREATED_USER_LNAME, inviter.getLastName(),
                EmailNotificationTemplateConstants.USER_INVITEE_FNAME, invitee.getFirstName(),
                EmailNotificationTemplateConstants.USER_INVITEE_LNAME, invitee.getLastName(),
                EmailNotificationTemplateConstants.ESOS_HELPDESK, esosHelpdesk
        ));
    }

    @Test
    void notifyUsersUpdateStatus() {
        String roleName = "roleName";
        RoleDTO roleDTO = RoleDTO.builder().code(AuthorityConstants.OPERATOR_ROLE_CODE).name(roleName).build();

        NewUserActivated operator1 = NewUserActivated.builder().userId("operator1").roleCode(AuthorityConstants.OPERATOR_ROLE_CODE).build();
        NewUserActivated operator2 = NewUserActivated.builder().userId("operator2").roleCode(AuthorityConstants.OPERATOR_ROLE_CODE).build();

        List<NewUserActivated> activatedOperators = List.of(operator1, operator2);

        when(roleService.getRoleByCode(AuthorityConstants.OPERATOR_ROLE_CODE)).thenReturn(roleDTO);

        // Invoke
        operatorUserNotificationGateway.notifyUsersUpdateStatus(activatedOperators);

        // Verify
        verify(userNotificationService, times(1))
                .notifyUserAccountActivation(operator1.getUserId(), roleDTO.getName());
        verify(userNotificationService, times(1))
                .notifyUserAccountActivation(operator2.getUserId(), roleDTO.getName());
        verify(roleService, times(2)).getRoleByCode(roleDTO.getCode());
        verifyNoMoreInteractions(userNotificationService);
    }

    private UserNotificationWithRedirectionLinkInfo.TokenParams expectedInvitationLinkTokenParams(JwtTokenActionEnum jwtTokenAction,
                                                                                                  String claimValue, long expirationInterval) {
        return UserNotificationWithRedirectionLinkInfo.TokenParams.builder()
            .jwtTokenAction(jwtTokenAction)
            .claimValue(claimValue)
            .expirationInterval(expirationInterval)
            .build();
    }
}