package uk.gov.esos.api.common.domain.transform;

import org.mapstruct.Mapper;
import uk.gov.esos.api.common.domain.CountyAddress;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.transform.MapperConfig;

@Mapper(
    componentModel = "spring",
    config = MapperConfig.class
)
public interface CountyAddressMapper {

    CountyAddressDTO toCountyAddressDTO(CountyAddress source);
    
    CountyAddress toCountyAddress(CountyAddressDTO source);
}