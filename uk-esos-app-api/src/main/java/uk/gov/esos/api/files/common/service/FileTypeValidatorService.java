package uk.gov.esos.api.files.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.files.common.FileTypesProperties;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;

import jakarta.validation.Valid;

@Component
@Validated
@RequiredArgsConstructor
public class FileTypeValidatorService implements FileValidatorService {
    private final FileTypesProperties fileTypesProperties;

    @Override
    public void validate(@Valid FileDTO fileDTO) {
        if (fileTypesProperties.getAllowedMimeTypes().stream()
                .noneMatch(mimeType -> mimeType.equals(fileDTO.getFileType()))) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }
    }
}
