package uk.gov.esos.api.reporting.noc.phase3.domain;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.common.domain.dto.validation.PhoneNumberIntegrity;
import uk.gov.esos.api.common.domain.dto.validation.PhoneNumberNotBlank;
import uk.gov.esos.api.common.domain.dto.validation.PhoneNumberValidity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactPerson {

    @NotBlank
    @Size(max = 255)
    private String firstName;

    @NotBlank
    @Size(max = 255)
    private String lastName;

    @Size(max = 255)
    private String jobTitle;

    @PhoneNumberNotBlank
    @PhoneNumberIntegrity
    @PhoneNumberValidity
    @Valid
    private PhoneNumberDTO phoneNumber;

    @PhoneNumberIntegrity
    @PhoneNumberValidity
    @Valid
    private PhoneNumberDTO mobileNumber;

    @Email
    @Size(max = 255)
    @NotBlank
    private String email;

    @JsonUnwrapped
    @NotNull
    @Valid
    private CountyAddressDTO address;
}
