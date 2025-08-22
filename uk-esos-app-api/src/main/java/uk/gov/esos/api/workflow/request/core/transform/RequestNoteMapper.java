package uk.gov.esos.api.workflow.request.core.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.request.core.domain.RequestNote;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestNoteDto;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface RequestNoteMapper {

	@Mapping(target = "editable", expression = "java(roleType.equals(requestNote.getRoleType()))")
    RequestNoteDto toRequestNoteDTO(RequestNote requestNote, RoleType roleType);	
}
