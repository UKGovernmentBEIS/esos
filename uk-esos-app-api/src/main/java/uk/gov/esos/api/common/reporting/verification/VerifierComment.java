package uk.gov.esos.api.common.reporting.verification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VerifierComment {

    @NotBlank
    @Size(max = 10000)
    private String reference;

    @NotBlank
    @Size(max = 10000)
    private String explanation;
}
