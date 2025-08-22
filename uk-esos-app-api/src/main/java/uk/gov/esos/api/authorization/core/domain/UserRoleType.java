package uk.gov.esos.api.authorization.core.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;
import org.hibernate.annotations.Synchronize;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

/**
 * Read-only entity that represents the role type of a user.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
@Entity
@Subselect("select distinct user_id,  "
    + "case "
    + "when account_id is not null then 'OPERATOR' "
    + "when competent_authority is not null then 'REGULATOR' "
    + "when verification_body_id is not null then 'VERIFIER' "
    + "end as role_type "
    + "from au_authority")
@Immutable
@Synchronize({"au_authority"})
public class UserRoleType {

    @Id
    private String userId;

    @NotNull
    @Enumerated(EnumType.STRING)
    private RoleType roleType;
}
