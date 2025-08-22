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

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrganisationAccountUpdateDTO {

    @NotBlank
    @Size(max = 255)
    private String name;
    
    @NotNull
    @Valid
    @JsonUnwrapped
    private ClassificationCodes codes;

    @NotNull
    @Valid
    @JsonUnwrapped
    private CountyAddressDTO address;
}
