package uk.gov.esos.api.workflow.request.flow.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.files.common.domain.FileStatus;
import uk.gov.esos.api.files.common.domain.dto.FileUuidDTO;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.attachments.service.FileAttachmentService;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskUploadAttachmentActionHandlerMapper;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class RequestTaskAttachmentUploadService {

    private final FileAttachmentService fileAttachmentService;
    private final RequestTaskUploadAttachmentActionHandlerMapper requestTaskUploadAttachmentActionHandlerMapper;

    @Transactional
    public FileUuidDTO uploadAttachment(Long requestTaskId, RequestTaskActionType requestTaskActionType,
                                        AppUser authUser, FileDTO fileDTO) throws IOException {
        final String attachmentUuid = fileAttachmentService.createFileAttachment(fileDTO, FileStatus.PENDING, authUser);
        
		requestTaskUploadAttachmentActionHandlerMapper.get(requestTaskActionType).uploadAttachment(requestTaskId,
				attachmentUuid, fileDTO.getFileName());
		return FileUuidDTO.builder().uuid(attachmentUuid).build();
    }
}
