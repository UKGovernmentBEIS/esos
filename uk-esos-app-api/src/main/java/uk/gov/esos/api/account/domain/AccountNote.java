package uk.gov.esos.api.account.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.common.note.Note;

@Entity
@SequenceGenerator(name = "default_note_id_generator", sequenceName = "account_note_seq", allocationSize = 1)
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "account_note")
public class AccountNote extends Note {

    @Column(name = "account_id")
    private Long accountId;
}
