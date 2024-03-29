package uk.gov.esos.api.user.core.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OneTimePasswordDTO {

    @NotBlank(message = "{otp.password.notEmpty}")
    private String password;
}
