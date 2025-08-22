package uk.gov.esos.api.account.client.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyProfileDTO {

    private String name;

    private String registrationNumber;

    private CountyAddressDTO address;

    private List<String> sicCodes;
}
