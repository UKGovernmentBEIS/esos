package uk.gov.esos.api.verificationbody.domain.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class VerificationBodyUpdateDTO {
    
    @NotNull
    private Long id;
    
    @JsonUnwrapped
    @Valid
    private VerificationBodyEditDTO verificationBody;

}
