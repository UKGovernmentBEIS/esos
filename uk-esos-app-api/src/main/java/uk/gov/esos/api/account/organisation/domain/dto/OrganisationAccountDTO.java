package uk.gov.esos.api.account.organisation.domain.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class OrganisationAccountDTO {

    private long id;

    private String registrationNumber;

    @NotNull
    @NotBlank
    private String name;
    
    @NotNull
    @Valid
    @JsonUnwrapped
    private ClassificationCodes codes;

    @NotNull
    @Valid
    @JsonUnwrapped
    private CountyAddressDTO address;

    @NotNull
    private CompetentAuthorityEnum competentAuthority;

    private String organisationId;

    private OrganisationAccountStatus status;
    
    private boolean editable;
}
