package uk.gov.esos.api.account.transform;

import org.mapstruct.Mapper;

import uk.gov.esos.api.account.domain.AccountNote;
import uk.gov.esos.api.account.domain.dto.AccountNoteDto;
import uk.gov.esos.api.common.transform.MapperConfig;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface AccountNoteMapper {

    AccountNoteDto toAccountNoteDTO(AccountNote accountNote, boolean editable);
}
