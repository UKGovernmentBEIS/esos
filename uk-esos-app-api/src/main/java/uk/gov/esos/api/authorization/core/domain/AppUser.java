package uk.gov.esos.api.authorization.core.domain;

import io.swagger.v3.oas.annotations.Hidden;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Hidden
public class AppUser {

    /** The keycloak user Id. */
    private String userId;

    /** The keycloak user email. */
    private String email;

    /** The keycloak user first name. */
    private String firstName;

    /** The keycloak user last name. */
    private String lastName;

    /** The List of {@link AppAuthority} applicable user authorities. */
    @Builder.Default
    private List<AppAuthority> authorities = new ArrayList<>();

    /** The {@link RoleType}. */
    private RoleType roleType;

    public Set<Long> getAccounts() {
        return this.authorities.stream()
            .map(AppAuthority::getAccountId)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());
    }

    /**
     * Returns the current user's {@link AppUser} verificationBodyId.
     * @return null if {@link AppUser} is {@link RoleType#VERIFIER}
     */
    public Long getVerificationBodyId() {
        return this.authorities.isEmpty() ? null : this.authorities.get(0).getVerificationBodyId();
    }

    /**
     * Returns the current user's {@link AppUser} {@link CompetentAuthorityEnum}.
     * @return null if {@link AppUser} is {@link RoleType#REGULATOR}
     */
    public CompetentAuthorityEnum getCompetentAuthority() {
        return this.authorities.isEmpty() ? null : this.authorities.get(0).getCompetentAuthority();
    }
    
    public String getFullName() {
	    return firstName + " " + lastName;
	}
}