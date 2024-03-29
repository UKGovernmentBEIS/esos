package gov.uk.esos.keycloak.user.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDetailsRequestDTO {

    @EqualsAndHashCode.Include()
    private String id; // the user id
    private SignatureDTO signature;

}
