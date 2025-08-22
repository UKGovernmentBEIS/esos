package uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganisationUndertakingDetails {

    @NotBlank
    @Size(max = 255)
    private String organisationName;

    @Size(max = 255)
    private String registrationNumber;
}
