package uk.gov.esos.api.user.operator.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.user.core.domain.dto.TokenDTO;

@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
public class OperatorUserInviteAndRegisterDTO {

	@NotNull
	@Valid
    private OperatorUserRegistrationDTO operatorUserRegistrationDTO;
	
    @NotNull
    @Valid
    private TokenDTO invitationTokenDTO;

}
