package uk.gov.esos.api.files.documents.transform;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import uk.gov.esos.api.files.common.domain.FileStatus;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.esos.api.files.documents.domain.FileDocument;

class FileDocumentMapperTest {

    private FileDocumentMapper mapper;

    @BeforeEach
    void init() {
        mapper = Mappers.getMapper(FileDocumentMapper.class);
    }
    
    @Test
    void toFileDTO() {
        String uuid = UUID.randomUUID().toString();
        String name = "file document name";
        byte[] content = "cotnent".getBytes();
        FileDocument fileDocument = FileDocument.builder()
            .uuid(uuid)
            .fileName(name)
            .fileContent(content)
            .fileSize(content.length)
            .fileType("docx")
            .status(FileStatus.PENDING)
            .createdBy("user")
            .lastUpdatedOn(LocalDateTime.now())
            .build();

        FileDTO result = mapper.toFileDTO(fileDocument);

        assertThat(result.getFileName()).isEqualTo(name);
        assertThat(result.getFileContent()).isEqualTo(content);
        assertThat(result.getFileType()).isEqualTo("docx");
        assertThat(result.getFileSize()).isEqualTo(content.length);
    }
    
    @Test
    void toFileInfoDTO() {
        String uuid = UUID.randomUUID().toString();
        String name = "file document name";
        FileDocument fileDocument = FileDocument.builder()
            .uuid(uuid)
            .fileName(name)
            .lastUpdatedOn(LocalDateTime.now())
            .build();

        FileInfoDTO result = mapper.toFileInfoDTO(fileDocument);

        assertThat(result.getName()).isEqualTo(name);
        assertThat(result.getUuid()).isEqualTo(uuid);
    }
}
