package uk.gov.esos.api.workflow.request.flow.common.service.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.esos.api.notification.template.domain.dto.templateparams.TemplateParams;
import uk.gov.esos.api.notification.template.domain.enumeration.DocumentTemplateType;
import uk.gov.esos.api.notification.template.service.DocumentFileGeneratorService;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.esos.api.workflow.request.flow.common.service.DecisionNotificationUsersService;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestAccountContactQueryService;

@Service
@RequiredArgsConstructor
public class OfficialNoticeGeneratorService {

    private final RequestAccountContactQueryService requestAccountContactQueryService;
    private final DecisionNotificationUsersService decisionNotificationUsersService;
    private final DocumentTemplateOfficialNoticeParamsProvider documentTemplateOfficialNoticeParamsProvider;
    private final DocumentFileGeneratorService documentFileGeneratorService;

    public FileInfoDTO generate(Request request, 
    							DocumentTemplateGenerationContextActionType type,
                                DocumentTemplateType documentTemplateType,
                                AccountType accountType,
                                DecisionNotification decisionNotification,
                                String fileNameToGenerate) {
        final UserInfoDTO accountPrimaryContact = requestAccountContactQueryService.getRequestAccountPrimaryContact(request)
            .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_FOUND));

        final TemplateParams templateParams = documentTemplateOfficialNoticeParamsProvider.constructTemplateParams(
            DocumentTemplateParamsSourceData.builder()
                .contextActionType(type)
                .request(request)
                .signatory(decisionNotification.getSignatory())
                .accountPrimaryContact(accountPrimaryContact)
                .toRecipientEmail(accountPrimaryContact.getEmail())
                .ccRecipientsEmails(decisionNotificationUsersService.findUserEmails(decisionNotification))
                .build()
        );

        return documentFileGeneratorService.generateFileDocument(
            documentTemplateType, templateParams, fileNameToGenerate);
    }
}
