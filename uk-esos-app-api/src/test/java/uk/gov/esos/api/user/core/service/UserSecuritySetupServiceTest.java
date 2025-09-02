package uk.gov.esos.api.user.core.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.notification.mail.config.property.NotificationProperties;
import uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants;
import uk.gov.esos.api.token.JwtTokenService;
import uk.gov.esos.api.token.JwtTokenActionEnum;
import uk.gov.esos.api.user.NavigationOutcomes;
import uk.gov.esos.api.token.JwtProperties;
import uk.gov.esos.api.user.core.domain.dto.TokenDTO;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.domain.model.UserNotificationWithRedirectionLinkInfo;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName.CHANGE_2FA;

@ExtendWith(MockitoExtension.class)
class UserSecuritySetupServiceTest {

    @InjectMocks
    private UserSecuritySetupService userSecuritySetupService;

    @Mock
    private UserNotificationService userNotificationService;

    @Mock
    private UserAuthService userAuthService;

    @Mock
    private JwtTokenService jwtTokenService;

    @Mock
    private JwtProperties jwtProperties;

    @Mock
    private NotificationProperties notificationProperties;

    @Test
    void requestTwoFactorAuthChange() {
        AppUser pmrvUser = AppUser.builder().email("email").build();
        String contactUsLink = "/contact-us";
        String otp = "otp";
        String accessToken = "accessToken";
        JwtProperties.Claim claim = mock(JwtProperties.Claim.class);
        Long expirationInterval = 60L;
        NotificationProperties.Email notificationEmail = mock(NotificationProperties.Email.class);

        when(jwtProperties.getClaim()).thenReturn(claim);
        when(claim.getChange2faExpIntervalMinutes()).thenReturn(expirationInterval);
        when(notificationProperties.getEmail()).thenReturn(notificationEmail);
        when(notificationEmail.getEsosHelpdesk()).thenReturn(contactUsLink);

        userSecuritySetupService.requestTwoFactorAuthChange(pmrvUser, accessToken, otp);

        verify(userAuthService, times(1)).validateAuthenticatedUserOtp(otp, accessToken);
        ArgumentCaptor<UserNotificationWithRedirectionLinkInfo> notificationInfoCaptor =
            ArgumentCaptor.forClass(UserNotificationWithRedirectionLinkInfo.class);
        verify(userNotificationService, times(1)).notifyUserWithLink(notificationInfoCaptor.capture());

        UserNotificationWithRedirectionLinkInfo notificationInfo = notificationInfoCaptor.getValue();

        assertThat(notificationInfo.getTemplateName()).isEqualTo(CHANGE_2FA);
        assertThat(notificationInfo.getUserEmail()).isEqualTo(pmrvUser.getEmail());
        assertThat(notificationInfo.getLinkParamName()).isEqualTo(EmailNotificationTemplateConstants.CHANGE_2FA_LINK);
        assertThat(notificationInfo.getLinkPath()).isEqualTo(NavigationOutcomes.CHANGE_2FA_URL);
        assertThat(notificationInfo.getNotificationParams()).hasSize(2);
        assertThat(notificationInfo.getNotificationParams())
                .isEqualTo(Map.of(
                        EmailNotificationTemplateConstants.ESOS_HELPDESK, contactUsLink,
                        EmailNotificationTemplateConstants.EXPIRATION_MINUTES, 60L));
        assertThat(notificationInfo.getTokenParams())
            .isEqualTo(expectedTokenParams(pmrvUser.getEmail(), expirationInterval));
    }

    @Test
    void deleteOtpCredentials() {
        TokenDTO token = TokenDTO.builder().token("token").build();
        String userEmail = "email";

        when(jwtTokenService.resolveTokenActionClaim(token.getToken(), JwtTokenActionEnum.CHANGE_2FA)).thenReturn(userEmail);

        userSecuritySetupService.deleteOtpCredentials(token);

        verify(userAuthService, times(1)).deleteOtpCredentialsByEmail(userEmail);
    }
    
    @Test
    void resetUser2Fa() {
        String userId = "123abcd";
        
        userSecuritySetupService.resetUser2Fa(userId);

        verify(userAuthService, times(1)).deleteOtpCredentials(userId);
        verify(userNotificationService, times(1)).notifyUserReset2Fa(userId);
    }

    @Test
    void requestToReset2fa() {
        String email = "email";
        String userId = "123abcd";

        when(userAuthService.getUserByEmail(email)).thenReturn(Optional.of(UserInfoDTO.builder().userId(userId).build()));
        userSecuritySetupService.requestToReset2fa(email);

        verify(userAuthService, times(1)).sendUpdateTotpMagicLink(userId);
    }

    private UserNotificationWithRedirectionLinkInfo.TokenParams expectedTokenParams(String claimValue, Long expirationInterval) {
        return UserNotificationWithRedirectionLinkInfo.TokenParams.builder()
            .jwtTokenAction(JwtTokenActionEnum.CHANGE_2FA)
            .claimValue(claimValue)
            .expirationInterval(expirationInterval)
            .build();
    }
}