package uk.gov.esos.api.common.domain.dto;

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
public class CountyAddressDTO {

    @NotBlank(message = "{address.line1.notEmpty}")
    @Size(max = 255, message = "{address.line1.typeMismatch}")
    private String line1;

    @Size(max = 255, message = "{address.line2.typeMismatch}")
    private String line2;

    @NotBlank(message = "{address.city.notEmpty}")
    @Size(max = 255, message = "{address.city.typeMismatch}")
    private String city;

    @Size(max = 255, message = "{address.county.typeMismatch}")
    private String county;

    @NotBlank(message = "{address.postcode.notEmpty}")
    @Size(max = 64, message = "{address.postcode.typeMismatch}")
    private String postcode;
}
