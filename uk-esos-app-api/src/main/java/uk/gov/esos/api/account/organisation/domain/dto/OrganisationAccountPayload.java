package uk.gov.esos.api.account.organisation.domain.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganisationAccountPayload {

    @Size(max = 255, message = "{account.organisation.registrationNumber.typeMismatch}")
    private String registrationNumber;

    @NotBlank(message = "{account.organisation.name.notEmpty}")
    @Size(max = 255, message = "{account.organisation.name.typeMismatch}")
    private String name;

    @NotNull(message = "{account.organisation.competentAuthority.notEmpty}")
    private CompetentAuthorityEnum competentAuthority;

    @JsonUnwrapped
    @NotNull(message = "{account.organisation.address.notEmpty}")
    @Valid
    private CountyAddressDTO address;
    
    @JsonUnwrapped
    @NotNull(message = "{account.organisation.codes.notEmpty}")
    @Valid
    private ClassificationCodes codes;
}
