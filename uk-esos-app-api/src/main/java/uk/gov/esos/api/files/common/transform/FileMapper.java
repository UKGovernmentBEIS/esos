package uk.gov.esos.api.files.common.transform;

import org.mapstruct.Mapper;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.files.common.domain.FileEntity;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface FileMapper {

    FileDTO toFileDTO(FileEntity fileEntity);
}
