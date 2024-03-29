package uk.gov.esos.api.files.documents.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.common.utils.MimeTypeUtils;
import uk.gov.esos.api.files.common.domain.FileStatus;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.esos.api.files.documents.domain.FileDocument;
import uk.gov.esos.api.files.documents.repository.FileDocumentRepository;

@ExtendWith(MockitoExtension.class)
class FileDocumentServiceTest {

    @InjectMocks
    private FileDocumentService service;

    @Mock
    private FileDocumentRepository fileDocumentRepository;

    @Test
    void getFileDTO() {
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
        
        when(fileDocumentRepository.findByUuid(uuid)).thenReturn(Optional.of(fileDocument));
        
        FileDTO result = service.getFileDTO(uuid);
        
        assertThat(result).isEqualTo(FileDTO.builder()
                .fileName(name).fileSize(content.length).fileType("docx").fileContent(content)
                .build());
        verify(fileDocumentRepository, times(1)).findByUuid(uuid);
    }
    
    @Test
    void getFileInfoDTO() {
        String uuid = UUID.randomUUID().toString();
        String name = "file document name";
        FileDocument fileDocument = FileDocument.builder()
            .uuid(uuid)
            .fileName(name)
            .lastUpdatedOn(LocalDateTime.now())
            .build();
        
        when(fileDocumentRepository.findByUuid(uuid)).thenReturn(Optional.of(fileDocument));
        
        FileInfoDTO result = service.getFileInfoDTO(uuid);
        
        assertThat(result).isEqualTo(FileInfoDTO.builder()
        		.name(name)
        		.uuid(uuid)
                .build());
        verify(fileDocumentRepository, times(1)).findByUuid(uuid);
    }
    
    @Test
    void createFileDocument() throws IOException {
        Path sampleFilePath = Paths.get("src", "test", "resources", "files", "sample.pdf");
        byte[] fileContent = Files.readAllBytes(sampleFilePath);
        String fileName = "file document name.pdf";
        
        FileInfoDTO result = service.createFileDocument(fileContent, fileName);
        assertThat(result.getName()).isEqualTo(fileName);
        assertThat(result.getUuid()).isNotBlank();
        
        ArgumentCaptor<FileDocument> fileDocumentCaptor = ArgumentCaptor.forClass(FileDocument.class);
        verify(fileDocumentRepository, times(1)).save(fileDocumentCaptor.capture());
        FileDocument fileDocumentCaptured = fileDocumentCaptor.getValue();
        assertThat(fileDocumentCaptured.getFileName()).isEqualTo(fileName);
        assertThat(fileDocumentCaptured.getFileSize()).isEqualTo(fileContent.length);
        assertThat(fileDocumentCaptured.getFileType()).isEqualTo(MimeTypeUtils.detect(fileContent, fileName));
        assertThat(fileDocumentCaptured.getUuid()).isNotBlank();
        assertThat(fileDocumentCaptured.getStatus()).isEqualTo(FileStatus.SUBMITTED);
    }
    
    @Test
    void createFileDocumentWithUuid() throws IOException {
    	String uuid = UUID.randomUUID().toString();
        Path sampleFilePath = Paths.get("src", "test", "resources", "files", "sample.pdf");
        byte[] fileContent = Files.readAllBytes(sampleFilePath);
        String fileName = "file document name.pdf";
        
        FileInfoDTO result = service.createFileDocumentWithUuid(fileContent, fileName, uuid);
        assertThat(result.getName()).isEqualTo(fileName);
        assertThat(result.getUuid()).isNotBlank();
        
        ArgumentCaptor<FileDocument> fileDocumentCaptor = ArgumentCaptor.forClass(FileDocument.class);
        verify(fileDocumentRepository, times(1)).save(fileDocumentCaptor.capture());
        FileDocument fileDocumentCaptured = fileDocumentCaptor.getValue();
        assertThat(fileDocumentCaptured.getFileName()).isEqualTo(fileName);
        assertThat(fileDocumentCaptured.getFileType()).isEqualTo(MimeTypeUtils.detect(fileContent, fileName));
        assertThat(fileDocumentCaptured.getFileSize()).isEqualTo(fileContent.length);
        assertThat(fileDocumentCaptured.getUuid()).isEqualTo(uuid);
        assertThat(fileDocumentCaptured.getStatus()).isEqualTo(FileStatus.SUBMITTED);
        
    }
    
}
