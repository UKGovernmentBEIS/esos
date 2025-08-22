package uk.gov.esos.api.account.organisation.transform;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.common.domain.CountyAddress;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import static org.junit.jupiter.api.Assertions.*;

class OrganisationAccountMapperTest {

    private static final OrganisationAccountMapper mapper = Mappers.getMapper(OrganisationAccountMapper.class);

    @Test
    void toOrganisationAccountDTO() {
        OrganisationAccount source = OrganisationAccount.builder()
            .registrationNumber("number")
            .name("name")
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .accountType(AccountType.ORGANISATION)
            .status(OrganisationAccountStatus.LIVE)
            .address(CountyAddress.builder()
                .line1("line1")
                .city("city")
                .county("county")
                .postcode("postcode")
                .build())
            .location(CompetentAuthorityEnum.WALES)
            .build();

        //invoke
        OrganisationAccountDTO target = mapper.toOrganisationAccountDTO(source);

        //verify
        assertEquals(source.getName(), target.getName());
        assertEquals(source.getLocation(), target.getCompetentAuthority());
        assertEquals(source.getStatus(), target.getStatus());
        assertEquals(source.getRegistrationNumber(), target.getRegistrationNumber());
        assertEquals(source.getOrganisationId(), target.getOrganisationId());

        assertEquals(source.getAddress().getLine1(), target.getAddress().getLine1());
        assertEquals(source.getAddress().getCity(), target.getAddress().getCity());
        assertEquals(source.getAddress().getCounty(), target.getAddress().getCounty());
        assertEquals(source.getAddress().getPostcode(), target.getAddress().getPostcode());
    }

    @Test
    void toOrganisationAccount() {
        Long id = 2L;
        String organisationId = "orgId";

        OrganisationAccountDTO source = OrganisationAccountDTO.builder()
                .registrationNumber("number")
                .name("name")
                .competentAuthority(CompetentAuthorityEnum.WALES)
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .organisationId("random")
                .status(OrganisationAccountStatus.AWAITING_APPROVAL)
                .build();

        //invoke
        OrganisationAccount target =
            mapper.toOrganisationAccount(source, id, organisationId, AccountType.ORGANISATION, OrganisationAccountStatus.LIVE);

        //verify
        assertEquals(id, target.getId());
        assertEquals(source.getName(), target.getName());
        assertEquals(source.getCompetentAuthority(), target.getLocation());
        assertEquals(CompetentAuthorityEnum.ENGLAND, target.getCompetentAuthority());
        assertEquals(source.getRegistrationNumber(), target.getRegistrationNumber());
        assertEquals(OrganisationAccountStatus.LIVE, target.getStatus());
        assertEquals(AccountType.ORGANISATION, target.getAccountType());
        assertEquals(organisationId, target.getOrganisationId());

        assertEquals(source.getAddress().getLine1(), target.getAddress().getLine1());
        assertEquals(source.getAddress().getCity(), target.getAddress().getCity());
        assertEquals(source.getAddress().getCounty(), target.getAddress().getCounty());
        assertEquals(source.getAddress().getPostcode(), target.getAddress().getPostcode());
    }
}