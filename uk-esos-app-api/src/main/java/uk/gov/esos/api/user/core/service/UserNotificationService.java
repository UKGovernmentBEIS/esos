package uk.gov.esos.api.user.core.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import uk.gov.esos.api.common.config.AppProperties;
import uk.gov.esos.api.notification.mail.config.property.NotificationProperties;
import uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants;
import uk.gov.esos.api.notification.mail.domain.EmailData;
import uk.gov.esos.api.notification.mail.domain.EmailNotificationTemplateData;
import uk.gov.esos.api.notification.mail.service.NotificationEmailService;
import uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName;
import uk.gov.esos.api.token.JwtTokenService;
import uk.gov.esos.api.user.NavigationParams;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.domain.model.UserNotificationWithRedirectionLinkInfo;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

import java.util.HashMap;
import java.util.Map;

import static uk.gov.esos.api.notification.mail.constants.EmailNotificationTemplateConstants.USER_ROLE_TYPE;
import static uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName.RESET_2FA_CONFIRMATION;
import static uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName.RESET_PASSWORD_CONFIRMATION;
import static uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName.USER_ACCOUNT_ACTIVATION;
import static uk.gov.esos.api.notification.template.domain.enumeration.NotificationTemplateName.VERIFIED_ACCOUNT_INVITATION;

@Service
@RequiredArgsConstructor
public class UserNotificationService {

    private final UserAuthService userAuthService;
    private final NotificationEmailService notificationEmailService;
    private final AppProperties appProperties;
    private final NotificationProperties notificationProperties;
    private final JwtTokenService jwtTokenService;

    /**
     * Sends email notification containing a redirection link to user.
     * @param notificationInfo {@link UserNotificationWithRedirectionLinkInfo}
     */
    public void notifyUserWithLink(UserNotificationWithRedirectionLinkInfo notificationInfo) {
        String redirectionLink = constructRedirectionLink(notificationInfo.getLinkPath(), notificationInfo.getTokenParams());

        Map<String, Object> notificationParameters = !ObjectUtils.isEmpty(notificationInfo.getNotificationParams()) ?
            notificationInfo.getNotificationParams() :
            new HashMap<>();

        notificationParameters.put(notificationInfo.getLinkParamName(), redirectionLink);

        notifyUser(notificationInfo.getUserEmail(), notificationInfo.getTemplateName(), notificationParameters);
    }

    public void notifyUserAccountActivation(String userId, String roleName) {
        UserInfoDTO user = userAuthService.getUserByUserId(userId);
        
        notifyUser(user.getEmail(), USER_ACCOUNT_ACTIVATION, Map.of(USER_ROLE_TYPE, roleName,
                EmailNotificationTemplateConstants.ESOS_HELPDESK, notificationProperties.getEmail().getEsosHelpdesk(),
                EmailNotificationTemplateConstants.HOME_URL, appProperties.getWeb().getUrl()));
    }

    public void notifyUserPasswordReset(String userId) {
        UserInfoDTO user = userAuthService.getUserByUserId(userId);
        
        notifyUser(user.getEmail(), RESET_PASSWORD_CONFIRMATION, Map.of(
        		EmailNotificationTemplateConstants.HOME_URL, appProperties.getWeb().getUrl(),
        		EmailNotificationTemplateConstants.ESOS_HELPDESK, notificationProperties.getEmail().getEsosHelpdesk()));
    }
    
    public void notifyUserReset2Fa(String userId) {
        UserInfoDTO user = userAuthService.getUserByUserId(userId);
        
        notifyUser(user.getEmail(), RESET_2FA_CONFIRMATION, Map.of(
        		EmailNotificationTemplateConstants.HOME_URL, appProperties.getWeb().getUrl(),
        		EmailNotificationTemplateConstants.ESOS_HELPDESK, notificationProperties.getEmail().getEsosHelpdesk()));
	}
    
    public void notifyVerifiedAccountUser(String email) {
    	notifyUser(email, VERIFIED_ACCOUNT_INVITATION, Map.of(
        		EmailNotificationTemplateConstants.HOME_URL, appProperties.getWeb().getUrl(),
        		EmailNotificationTemplateConstants.ESOS_HELPDESK, notificationProperties.getEmail().getEsosHelpdesk()));
	}
    
    /**
     * Sends generic email notification for specified template and params
     * @param email
     * @param templateName {@link NotificationTemplateName}
     * @param params
     * 
     */
    private void notifyUser(String email, NotificationTemplateName templateName, Map<String, Object> params) {
    	EmailData emailInfo = buildEmailData(templateName, params);

        notificationEmailService.notifyRecipient(emailInfo, email);
    }

	private EmailData buildEmailData(NotificationTemplateName templateName, Map<String, Object> params) {
		return EmailData.builder()
                .notificationTemplateData(EmailNotificationTemplateData.builder()
                        .templateName(templateName)
                        .templateParams(params)
                        .build())
                .build();
	}

    private String constructRedirectionLink(String path, UserNotificationWithRedirectionLinkInfo.TokenParams tokenParams) {
        String token = jwtTokenService
            .generateToken(tokenParams.getJwtTokenAction(), tokenParams.getClaimValue(), tokenParams.getExpirationInterval());

        return UriComponentsBuilder
            .fromHttpUrl(appProperties.getWeb().getUrl())
            .path("/")
            .path(path)
            .queryParam(NavigationParams.TOKEN, token)
            .build()
            .toUriString();
    }	
}
