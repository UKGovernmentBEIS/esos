package uk.gov.esos.api.user.core.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.user.core.domain.dto.validation.Password;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitedUserEnableDTO {

    @NotBlank(message = "{jwt.token.notEmpty}")
    private String invitationToken;

    @NotBlank(message = "{userAccount.password.notEmpty}")
    @Password(message = "{userAccount.password.typeMismatch}")
    private String password;
}
