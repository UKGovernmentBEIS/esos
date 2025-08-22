package uk.gov.esos.api.user.core.domain.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class TokenDTO {

    @NotBlank(message = "{jwt.token.notEmpty}")
    private String token;
}
