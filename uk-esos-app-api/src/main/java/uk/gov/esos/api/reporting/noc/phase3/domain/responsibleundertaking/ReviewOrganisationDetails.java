package uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking;

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
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#registrationNumberExist) == (#registrationNumber != null)}", message = "noc.responsibleUndertaking.organisationDetails.registrationNumberExist")
public class ReviewOrganisationDetails {

    @NotBlank
    @Size(max = 255)
    private String name;

    @NotNull
    private Boolean registrationNumberExist;

    @Size(max = 255)
    private String registrationNumber;

    @JsonUnwrapped
    @NotNull
    @Valid
    private CountyAddressDTO address;

    @JsonUnwrapped
    @NotNull(message = "{account.organisation.codes.notEmpty}")
    @Valid
    private ClassificationCodes codes;
}
