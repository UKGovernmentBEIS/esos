package uk.gov.esos.api.workflow.request.core.transform;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.core.domain.RequestNote;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestNoteDto;

class RequestNoteMapperTest {

	private final RequestNoteMapper mapper = Mappers.getMapper(RequestNoteMapper.class);

    @Test
    void toRequestNoteDTO() {
    	RequestNote note = RequestNote.builder()
    			.requestId("id")
    			.roleType(RoleType.OPERATOR)
    			.build();

        RequestNoteDto noteDto = mapper.toRequestNoteDTO(note, RoleType.OPERATOR);

        assertThat(noteDto.getRequestId()).isEqualTo("id");
        assertThat(noteDto.isEditable()).isTrue();
        
        noteDto = mapper.toRequestNoteDTO(note, RoleType.REGULATOR);
        assertThat(noteDto.isEditable()).isFalse();
    }
}
