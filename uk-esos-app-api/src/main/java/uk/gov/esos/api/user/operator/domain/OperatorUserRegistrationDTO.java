package uk.gov.esos.api.user.operator.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.common.domain.dto.validation.PhoneNumberIntegrity;
import uk.gov.esos.api.common.domain.dto.validation.PhoneNumberNotBlank;
import uk.gov.esos.api.common.domain.dto.validation.PhoneNumberValidity;

@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
public class OperatorUserRegistrationDTO {

    @NotBlank(message = "{userAccount.firstName.notEmpty}")
    @Size(max = 255, message = "{userAccount.firstName.typeMismatch}")
    private String firstName;

    @NotBlank(message = "{userAccount.lastName.notEmpty}")
    @Size(max = 255, message = "{userAccount.lastName.typeMismatch}")
    private String lastName;

    @Size(max = 255, message = "{userAccount.jobTitle.typeMismatch}")
    private String jobTitle;

    @NotNull
    @Valid
    private CountyAddressDTO address;

    @PhoneNumberNotBlank(message = "{userAccount.phoneNumber.notEmpty}")
    @PhoneNumberIntegrity(message = "{userAccount.phoneNumber.typeMismatch}")
    @PhoneNumberValidity(message="{userAccount.phoneNumber.invalid}")
    @Valid
    private PhoneNumberDTO phoneNumber;

    @PhoneNumberIntegrity(message = "{userAccount.mobileNumber.typeMismatch}")
    @PhoneNumberValidity(message="{userAccount.mobileNumber.invalid}")
    @Valid
    private PhoneNumberDTO mobileNumber;

    @Max(value = 255)
    private Short termsVersion;
}
