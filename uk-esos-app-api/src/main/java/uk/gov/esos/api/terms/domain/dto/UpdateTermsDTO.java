package uk.gov.esos.api.terms.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * The updateTerms DTO.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTermsDTO {

    @NotNull(message = "{terms.version.notEmpty}")
    private Short version;

}
