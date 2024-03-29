package uk.gov.esos.api.user.core.domain.dto;

import jakarta.validation.constraints.Max;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class ApplicationUserDTO extends UserDTO {

    @Max(value = 255)
    private Short termsVersion;
}
