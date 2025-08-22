package uk.gov.esos.api.account.organisation.transform;

import org.mapstruct.Mapping;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.transform.CountyAddressMapper;
import uk.gov.esos.api.common.transform.MapperConfig;

@org.mapstruct.Mapper(
    componentModel = "spring",
    config = MapperConfig.class
)
public interface OrganisationAccountMapper extends CountyAddressMapper {

    @Mapping(target = "name", source = "accountDTO.name")
    @Mapping(target = "id",source = "id")
    @Mapping(target = "organisationId",source = "organisationId")
    @Mapping(target = "status",source = "status")
    @Mapping(target = "competentAuthority", expression = "java(uk.gov.esos.api.competentauthority.CompetentAuthorityEnum.ENGLAND)")
    @Mapping(target = "location", source = "accountDTO.competentAuthority")
    OrganisationAccount toOrganisationAccount(OrganisationAccountDTO accountDTO, Long id, String organisationId,
                                              AccountType accountType, OrganisationAccountStatus status);

    @Mapping(target = "competentAuthority", source = "source.location")
    OrganisationAccountDTO toOrganisationAccountDTO(OrganisationAccount source);
}
