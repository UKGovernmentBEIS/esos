package uk.gov.esos.api.user.core.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.user.core.domain.model.UserDetailsRequest;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface UserDetailsMapper {

    @Mapping(target = "id", source = "userId")
    @Mapping(target = "signature.content", source = "signature.fileContent")
    @Mapping(target = "signature.name", source = "signature.fileName")
    @Mapping(target = "signature.type", source = "signature.fileType")
    @Mapping(target = "signature.size", source = "signature.fileSize")
    UserDetailsRequest toUserDetails(String userId, FileDTO signature);
}
