package uk.gov.esos.api.files.documents.service;

import java.util.List;

import jakarta.validation.Valid;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.files.common.FileType;
import uk.gov.esos.api.files.common.domain.FileStatus;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.esos.api.files.common.service.FileValidatorService;
import uk.gov.esos.api.files.documents.domain.FileDocumentTemplate;
import uk.gov.esos.api.files.documents.repository.FileDocumentTemplateRepository;
import uk.gov.esos.api.files.documents.transform.FileDocumentTemplateMapper;

@Validated
@Service
@RequiredArgsConstructor
public class FileDocumentTemplateService {

    private final FileDocumentTemplateRepository fileDocumentTemplateRepository;
    private final List<FileValidatorService> fileValidators;
    private static final FileDocumentTemplateMapper fileDocumentTemplateMapper = Mappers.getMapper(FileDocumentTemplateMapper.class);

    public FileInfoDTO getFileInfoDocumentTemplateById(Long fileDocumentTemplateId) {
        return fileDocumentTemplateRepository.findById(fileDocumentTemplateId)
            .map(fileDocumentTemplateMapper::toFileInfoDTO)
            .orElseThrow(() ->  new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }
    
    @Transactional(readOnly = true)
    public FileDTO getFileDocumentTemplateById(Long fileDocumentTemplateId) {
        return fileDocumentTemplateRepository.findById(fileDocumentTemplateId)
            .map(fileDocumentTemplateMapper::toFileDTO)
            .orElseThrow(() ->  new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    @Transactional
    public Long createFileDocumentTemplate(@Valid FileDTO fileDTO, String authUserId) {
        validateFile(fileDTO);
        FileDocumentTemplate fileDocumentTemplate = fileDocumentTemplateMapper.toFileDocumentTemplate(fileDTO, FileStatus.SUBMITTED, authUserId);
        fileDocumentTemplateRepository.save(fileDocumentTemplate);
        return fileDocumentTemplate.getId();
    }
    
    @Transactional
    public void deleteFileDocumentTemplateById(Long fileDocumentTemplateId) {
        fileDocumentTemplateRepository.deleteById(fileDocumentTemplateId);
    }

    private void validateFile(FileDTO fileDTO) {
        if(!FileType.DOCX.getMimeTypes().contains(fileDTO.getFileType())) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE, FileType.DOCX.getSimpleType());
        }
        fileValidators.forEach(validator -> validator.validate(fileDTO));
    }
}
