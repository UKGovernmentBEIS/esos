package uk.gov.esos.api.account.client.transform;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.account.client.domain.CompanyAddress;
import uk.gov.esos.api.account.client.domain.CompanyProfile;
import uk.gov.esos.api.account.client.domain.dto.CompanyProfileDTO;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CompanyInformationMapperTest {

    private static final CompanyInformationMapper mapper = Mappers.getMapper(CompanyInformationMapper.class);

    @Test
    void toCompanyProfileDTO() {
        String name = "companyName";
        String registrationNumber = "GR909087";
        List<String> sicCodes = List.of("12345", "98765");
        CompanyProfile companyProfile = CompanyProfile.builder()
            .name(name)
            .registrationNumber(registrationNumber)
            .status("active")
            .jurisdiction("scotland")
            .address(CompanyAddress.builder()
                .line1("line1")
                .line2("line2")
                .city("city")
                .country("country")
                .county("county")
                .postcode("code")
                .build())
            .sicCodes(sicCodes)
            .build();

        CompanyProfileDTO expected = CompanyProfileDTO.builder()
            .name(name)
            .registrationNumber(registrationNumber)
            .sicCodes(sicCodes)
            .address(CountyAddressDTO.builder()
                .line1("line1")
                .line2("line2")
                .county("county")
                .city("city")
                .postcode("code")
                .build())
            .build();

        CompanyProfileDTO actual = mapper.toCompanyProfileDTO(companyProfile);

        assertEquals(expected, actual);
    }

}