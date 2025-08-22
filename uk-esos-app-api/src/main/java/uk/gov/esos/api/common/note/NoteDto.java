package uk.gov.esos.api.common.note;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class NoteDto {

    private Long id;
    private NotePayload payload;
    private String submitter;
    private LocalDateTime lastUpdatedOn;
    private boolean isEditable;
}
