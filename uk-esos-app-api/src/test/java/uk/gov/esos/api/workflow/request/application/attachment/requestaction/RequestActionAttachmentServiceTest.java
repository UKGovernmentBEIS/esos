package uk.gov.esos.api.workflow.request.application.attachment.requestaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.files.attachments.service.FileAttachmentTokenService;
import uk.gov.esos.api.workflow.request.core.domain.RequestAction;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.repository.RequestActionRepository;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.domain.OrganisationAccountOpeningApplicationSubmittedRequestActionPayload;

@ExtendWith(MockitoExtension.class)
class RequestActionAttachmentServiceTest {

    @InjectMocks
    private RequestActionAttachmentService requestActionAttachmentService;

    @Mock
    private RequestActionRepository requestActionRepository;

    @Mock
    private FileAttachmentTokenService fileAttachmentTokenService;

    @Test
    void generateGetFileAttachmentToken_request_action_not_exists(){
        Long requestActionId = 1L;
        UUID attachmentUuid = UUID.randomUUID();

        when(requestActionRepository.findById(requestActionId)).thenReturn(Optional.empty());

        BusinessException businessException = assertThrows(BusinessException.class, () ->
            requestActionAttachmentService.generateGetFileAttachmentToken(requestActionId, attachmentUuid));

        assertThat(businessException.getErrorCode()).isEqualTo(RESOURCE_NOT_FOUND);

        verify(requestActionRepository, times(1)).findById(requestActionId);
        verifyNoInteractions(fileAttachmentTokenService);
    }

    @Test
    void generateGetFileAttachmentToken_attachment_not_exists_in_payload() {
        Long requestActionId = 1L;
        UUID attachmentUuid = UUID.randomUUID();
        OrganisationAccountOpeningApplicationSubmittedRequestActionPayload payload = OrganisationAccountOpeningApplicationSubmittedRequestActionPayload
            .builder()
            .payloadType(RequestActionPayloadType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED_PAYLOAD)
            .build();
        RequestAction requestAction = RequestAction.builder().id(requestActionId).payload(payload).build();

        when(requestActionRepository.findById(requestActionId)).thenReturn(Optional.of(requestAction));

        BusinessException businessException = assertThrows(BusinessException.class, () ->
            requestActionAttachmentService.generateGetFileAttachmentToken(requestActionId, attachmentUuid));

        assertThat(businessException.getErrorCode()).isEqualTo(RESOURCE_NOT_FOUND);

        verify(requestActionRepository, times(1)).findById(requestActionId);
        verifyNoInteractions(fileAttachmentTokenService);
    }
}
