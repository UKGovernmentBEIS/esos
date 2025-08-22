package uk.gov.esos.api.reporting.noc.phase3.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.reporting.noc.common.domain.NocSearchResults;
import uk.gov.esos.api.reporting.noc.common.domain.NocSearchResultsInfo;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.dto.NocP3SearchResultsDto;
import uk.gov.esos.api.reporting.noc.phase3.domain.dto.NocP3SearchResultsInfoDto;

import java.util.List;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface NocMapper {

    @Mapping(source = "nocSearchResultsInfos", target = "nocSearchResultsInfos", qualifiedByName = "toNocP3SearchResultsInfoDto")
    NocP3SearchResultsDto toNocP3SearchResultsDto(NocSearchResults results);

    @Named("toNocP3SearchResultsInfoDto")
    default List<NocP3SearchResultsInfoDto> toNocP3SearchResultsInfoDto(List<NocSearchResultsInfo> resultsInfos) {
        return resultsInfos.stream()
                .map(entity -> NocP3SearchResultsInfoDto.builder()
                        .id(entity.getId())
                        .organisationName(entity.getOrganisationName())
                        .registrationNumber(entity.getRegistrationNumber())
                        .location(entity.getLocation())
                        .noc(((NocP3Container) entity.getNocContainer()).getNoc())
                        .status(entity.getStatus())
                        .build())
                .toList();
    }
}
