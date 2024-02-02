package uk.gov.esos.api.workflow.request.flow.rde.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.esos.api.notification.template.domain.dto.templateparams.TemplateParams;
import uk.gov.esos.api.notification.template.domain.enumeration.DocumentTemplateType;
import uk.gov.esos.api.notification.template.service.DocumentFileGeneratorService;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.flow.common.service.notification.DocumentTemplateGenerationContextActionType;
import uk.gov.esos.api.workflow.request.flow.common.service.notification.DocumentTemplateOfficialNoticeParamsProvider;
import uk.gov.esos.api.workflow.request.flow.common.service.notification.DocumentTemplateParamsSourceData;
import uk.gov.esos.api.workflow.request.flow.common.service.notification.OfficialNoticeSendService;

@Service
@RequiredArgsConstructor
public class RdeSubmitOfficialNoticeService {

    private final DocumentTemplateOfficialNoticeParamsProvider documentTemplateOfficialNoticeParamsProvider;
    private final DocumentFileGeneratorService documentFileGeneratorService;
    private final OfficialNoticeSendService officialNoticeSendService;
    
    @Transactional
    public FileInfoDTO generateOfficialNotice(Request request, String signatory,
            UserInfoDTO accountPrimaryContact, List<String> ccRecipientsEmails) {
        final TemplateParams templateParams = documentTemplateOfficialNoticeParamsProvider.constructTemplateParams(DocumentTemplateParamsSourceData.builder()
                .request(request)
                .contextActionType(DocumentTemplateGenerationContextActionType.RDE_SUBMIT) 
                .signatory(signatory)
                .accountPrimaryContact(accountPrimaryContact)
                .toRecipientEmail(accountPrimaryContact.getEmail())
                .ccRecipientsEmails(ccRecipientsEmails)
                .build()
                );

        return documentFileGeneratorService.generateFileDocument(DocumentTemplateType.IN_RDE, templateParams,
                "Request for Determination Extension.pdf");
    }
    
    public void sendOfficialNotice(FileInfoDTO officialNotice, 
            Request request,
            List<String> ccRecipientsEmails) {
    	officialNoticeSendService.sendOfficialNotice(List.of(officialNotice), request, ccRecipientsEmails);
    }
}
