package uk.gov.esos.api.user.core.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.notification.mail.config.property.NotificationProperties;
import uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants;
import uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName;
import uk.gov.esos.api.token.JwtTokenService;
import uk.gov.esos.api.token.JwtProperties;
import uk.gov.esos.api.token.JwtTokenActionEnum;
import uk.gov.esos.api.user.NavigationOutcomes;
import uk.gov.esos.api.user.core.domain.dto.TokenDTO;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.domain.model.UserNotificationWithRedirectionLinkInfo;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserSecuritySetupService {

    private final UserNotificationService userNotificationService;
    private final UserAuthService userAuthService;
    private final JwtProperties jwtProperties;
    private final NotificationProperties notificationProperties;
    private final JwtTokenService jwtTokenService;

    public void requestTwoFactorAuthChange(AppUser currentUser, String accessToken, String otp) {
        // Validate otp
        userAuthService.validateAuthenticatedUserOtp(otp, accessToken);
        long expirationInMinutes = jwtProperties.getClaim().getChange2faExpIntervalMinutes();

        Map<String, Object> notificationParams = new HashMap<>(Map.of(
                EmailNotificationTemplateConstants.ESOS_HELPDESK, notificationProperties.getEmail().getEsosHelpdesk(),
                EmailNotificationTemplateConstants.EXPIRATION_MINUTES, expirationInMinutes
        ));

        // Send email with token
        userNotificationService.notifyUserWithLink(
            UserNotificationWithRedirectionLinkInfo.builder()
                .templateName(NotificationTemplateName.CHANGE_2FA)
                .userEmail(currentUser.getEmail())
                .notificationParams(notificationParams)
                .linkParamName(EmailNotificationTemplateConstants.CHANGE_2FA_LINK)
                .linkPath(NavigationOutcomes.CHANGE_2FA_URL)
                .tokenParams(UserNotificationWithRedirectionLinkInfo.TokenParams.builder()
                    .jwtTokenAction(JwtTokenActionEnum.CHANGE_2FA)
                    .claimValue(currentUser.getEmail())
                    .expirationInterval(expirationInMinutes)
                    .build()
                )
                .build()
        );
    }

    public void deleteOtpCredentials(TokenDTO tokenDTO) {
        // Validate token and get email
        String userEmail = jwtTokenService.resolveTokenActionClaim(tokenDTO.getToken(), JwtTokenActionEnum.CHANGE_2FA);

        // Delete otp credentials
        userAuthService.deleteOtpCredentialsByEmail(userEmail);
    }

    public void requestToReset2fa(String email) {
        userAuthService.getUserByEmail(email)
                .map(UserInfoDTO::getUserId)
                .ifPresent(userAuthService::sendUpdateTotpMagicLink);
    }
    
    public void resetUser2Fa(String userId) {
    	userAuthService.deleteOtpCredentials(userId);
        userNotificationService.notifyUserReset2Fa(userId);
    }
}
