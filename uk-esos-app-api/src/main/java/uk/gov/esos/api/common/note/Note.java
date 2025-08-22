package uk.gov.esos.api.common.note;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

import org.hibernate.annotations.Type;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public abstract class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "default_note_id_generator")
    private Long id;

    @Type(JsonType.class)
    @Column(name = "payload", columnDefinition = "jsonb")
    @NotNull
    private NotePayload payload;

    @Column(name = "submitter_id")
    @NotNull
    private String submitterId;

    @Column(name = "submitter")
    @NotNull
    private String submitter;

    @Column(name = "last_updated_on")
    @NotNull
    private LocalDateTime lastUpdatedOn;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role_type")
    @NotNull
    private RoleType roleType;
}
