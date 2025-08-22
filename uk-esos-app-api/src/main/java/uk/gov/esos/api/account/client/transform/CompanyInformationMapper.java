package uk.gov.esos.api.account.client.transform;

import uk.gov.esos.api.account.client.domain.CompanyProfile;
import uk.gov.esos.api.account.client.domain.dto.CompanyProfileDTO;
import uk.gov.esos.api.common.transform.MapperConfig;

@org.mapstruct.Mapper(componentModel = "spring", config = MapperConfig.class)
public interface CompanyInformationMapper {

    CompanyProfileDTO toCompanyProfileDTO(CompanyProfile companyProfile);
}
