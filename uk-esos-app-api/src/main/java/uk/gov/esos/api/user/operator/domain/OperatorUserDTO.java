package uk.gov.esos.api.user.operator.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.common.domain.dto.validation.PhoneNumberIntegrity;
import uk.gov.esos.api.common.domain.dto.validation.PhoneNumberNotBlank;
import uk.gov.esos.api.common.domain.dto.validation.PhoneNumberValidity;
import uk.gov.esos.api.user.core.domain.dto.ApplicationUserDTO;
import uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus;

/**
 * The Operator's details DTO.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class OperatorUserDTO extends ApplicationUserDTO {

	/** The authentication status. */
    private AuthenticationStatus status;

    /** The address. */
    @NotNull
    @Valid
    private CountyAddressDTO address;

    @Size(max = 255, message = "{userAccount.jobTitle.typeMismatch}")
    private String jobTitle;

    /** The phone number. */
    @PhoneNumberNotBlank(message = "{userAccount.phoneNumber.notEmpty}")
    @PhoneNumberIntegrity(message = "{userAccount.phoneNumber.typeMismatch}")
    @PhoneNumberValidity(message="{userAccount.phoneNumber.invalid}")
    @Valid
    private PhoneNumberDTO phoneNumber;

    /** The mobile number. */
    @PhoneNumberIntegrity(message = "{userAccount.mobileNumber.typeMismatch}")
    @PhoneNumberValidity(message="{userAccount.mobileNumber.invalid}")
    @Valid
    private PhoneNumberDTO mobileNumber;
}
