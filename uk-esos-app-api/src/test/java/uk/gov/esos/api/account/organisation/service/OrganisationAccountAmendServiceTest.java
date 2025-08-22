package uk.gov.esos.api.account.organisation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.account.organisation.domain.ClassificationCode;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.repository.OrganisationAccountRepository;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.ClassificationType;
import uk.gov.esos.api.common.domain.CountyAddress;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountAmendServiceTest {

    @InjectMocks
    private OrganisationAccountAmendService accountAmendService;

    @Mock
    private OrganisationAccountQueryService accountQueryService;

    @Mock
    private OrganisationAccountRepository accountRepository;

    @Test
    void amendAccount() {
        Long accountId = 1L;
        String updatedName = "updatedName";
        CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        String updatedRegNbr = "123";
        CountyAddressDTO updatedAddress = CountyAddressDTO.builder()
            .line1("line1")
            .line2("line2")
            .city("city")
            .county("county")
            .postcode("code")
            .build();
        OrganisationAccountDTO updatedAccountDTO = OrganisationAccountDTO.builder()
            .name(updatedName)
            .competentAuthority(ca)
            .registrationNumber(updatedRegNbr)
            .address(updatedAddress)
            .codes(ClassificationCodes.builder().type(ClassificationType.SIC).codes(List.of("sicCode")).build())
            .build();

        AccountType accountType = AccountType.ORGANISATION;
        OrganisationAccountStatus accountStatus = OrganisationAccountStatus.AWAITING_APPROVAL;
        String organisationId = "orgId";
        List<ClassificationCode> sicCodes = Stream.of(ClassificationCode.builder()
        		.type(ClassificationType.SIC)
        		.code("sicCode")
        		.build())
        	      .collect(Collectors.toList());
        OrganisationAccount existingAccount = OrganisationAccount.builder()
            .id(accountId)
            .name("initialName")
            .competentAuthority(ca)
            .accountType(accountType)
            .status(accountStatus)
            .organisationId(organisationId)
            .registrationNumber("000")
            .address(CountyAddress.builder()
                .line1("street")
                .city("Oxford")
                .county("Dorset")
                .postcode("089")
                .build())
            .classificationCodes(sicCodes)
            .build();

        when(accountQueryService.getAccountById(accountId)).thenReturn(existingAccount);

        //invoke
        accountAmendService.amendAccount(accountId, updatedAccountDTO);

        //verify
        verify(accountQueryService, times(1)).getAccountById(accountId);

        ArgumentCaptor<OrganisationAccount> updatedAccountCaptor = ArgumentCaptor.forClass(OrganisationAccount.class);
        verify(accountRepository, times(1)).save(updatedAccountCaptor.capture());

        OrganisationAccount updatedAccount = updatedAccountCaptor.getValue();

        assertEquals(accountId, updatedAccount.getId());
        assertEquals(accountType, updatedAccount.getAccountType());
        assertEquals(accountStatus, updatedAccount.getStatus());
        assertEquals(ca, updatedAccount.getCompetentAuthority());
        assertEquals(organisationId, updatedAccount.getOrganisationId());
        assertEquals(updatedName, updatedAccount.getName());
        assertEquals(updatedRegNbr, updatedAccount.getRegistrationNumber());

        CountyAddress updatedAccountAddress = updatedAccount.getAddress();

        assertEquals(updatedAddress.getLine1(), updatedAccountAddress.getLine1());
        assertEquals(updatedAddress.getLine2(), updatedAccountAddress.getLine2());
        assertEquals(updatedAddress.getCity(), updatedAccountAddress.getCity());
        assertEquals(updatedAddress.getCounty(), updatedAccountAddress.getCounty());
        assertEquals(updatedAddress.getPostcode(), updatedAccountAddress.getPostcode());
    }
}