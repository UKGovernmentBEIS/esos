package uk.gov.esos.api.files.common.service;

import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.files.common.FileConstants;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;

import jakarta.validation.Valid;

@Component
@Validated
public class FileSizeValidatorService implements FileValidatorService {

    @Override
    public void validate(@Valid FileDTO fileDTO) {
        long fileSize = fileDTO.getFileSize();

        if (fileSize <= FileConstants.MIN_FILE_SIZE) {
            throw new BusinessException(ErrorCode.MIN_FILE_SIZE_ERROR);
        }
        if (fileSize >= FileConstants.MAX_FILE_SIZE) {
            throw new BusinessException(ErrorCode.MAX_FILE_SIZE_ERROR);
        }
    }
}
