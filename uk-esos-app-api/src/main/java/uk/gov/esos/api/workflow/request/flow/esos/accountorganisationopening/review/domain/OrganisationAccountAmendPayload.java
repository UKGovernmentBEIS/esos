package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain;

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
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganisationAccountAmendPayload {

    @NotBlank(message = "{account.organisation.name.notEmpty}")
    @Size(max = 255, message = "{account.organisation.name.typeMismatch}")
    private String name;

    @JsonUnwrapped
    @NotNull(message = "{account.organisation.address.notEmpty}")
    @Valid
    private CountyAddressDTO address;
    
    @JsonUnwrapped
    @NotNull(message = "{account.organisation.codes.notEmpty}")
    @Valid
    private ClassificationCodes codes;
}
