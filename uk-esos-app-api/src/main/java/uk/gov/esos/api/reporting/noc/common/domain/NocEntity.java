package uk.gov.esos.api.reporting.noc.common.domain;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "noc")
public class NocEntity {

    @Id
    private String id;

    @Valid
    @Type(JsonType.class)
    @Column(name = "data", columnDefinition = "jsonb")
    private NocContainer nocContainer;

    @EqualsAndHashCode.Include()
    @NotNull
    @Column(name = "account_id")
    private Long accountId;

    @EqualsAndHashCode.Include()
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "phase")
    private Phase phase;
}
