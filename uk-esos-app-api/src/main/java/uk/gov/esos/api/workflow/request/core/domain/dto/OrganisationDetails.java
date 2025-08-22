package uk.gov.esos.api.workflow.request.core.domain.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrganisationDetails {

    private String name;

    private String registrationNumber;
    
    @JsonUnwrapped
    private ClassificationCodes codes;

    @JsonUnwrapped
    private CountyAddressDTO address;
}
