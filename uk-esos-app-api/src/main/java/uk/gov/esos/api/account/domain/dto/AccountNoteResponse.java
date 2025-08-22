package uk.gov.esos.api.account.domain.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountNoteResponse {
    
    private List<AccountNoteDto> accountNotes;
    private Long totalItems;
    private boolean hasUserEditPermission;
}
