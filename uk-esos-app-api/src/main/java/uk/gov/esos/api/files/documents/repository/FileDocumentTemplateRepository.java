package uk.gov.esos.api.files.documents.repository;

import org.springframework.stereotype.Repository;

import uk.gov.esos.api.files.common.repository.FileEntityRepository;
import uk.gov.esos.api.files.documents.domain.FileDocumentTemplate;

@Repository
public interface FileDocumentTemplateRepository extends FileEntityRepository<FileDocumentTemplate, Long> {

    boolean existsByUuid(String uuid);
}
