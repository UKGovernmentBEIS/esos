package uk.gov.esos.api.account.organisation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.account.organisation.domain.ClassificationCode;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountUpdateDTO;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.ClassificationType;
import uk.gov.esos.api.common.domain.CountyAddress;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountUpdateServiceTest {

	@InjectMocks
    private OrganisationAccountUpdateService organisationAccountUpdateService;

    @Mock
    private OrganisationAccountQueryService organisationAccountQueryService;


    @Test
    void updateOrganisationAccount() {

        Long accountId = 1L;
        String accountName = "accountName";

        OrganisationAccount account = createAccount(accountId, accountName);
        List<ClassificationCode> codes = new ArrayList<>();
        codes.add(ClassificationCode.builder()
        		.account(account)
        		.type(ClassificationType.SIC)
        		.code("code")
        		.build());
        account.setClassificationCodes(codes);
        
        CountyAddress address = CountyAddress.builder()
			.county("newCounty")
			.line1("newLine1")
			.postcode("newPostcode")
			.city("newCity")
			.build();

        ClassificationCodes newClassificationCodes = ClassificationCodes.builder()
    			.type(ClassificationType.SIC)
    			.codes(List.of("newCode"))
    			.build();
        OrganisationAccountUpdateDTO accountUpdateDTO = createAccountUpdateDTO(newClassificationCodes);   
        

        when(organisationAccountQueryService.getAccountById(accountId)).thenReturn(account);

        organisationAccountUpdateService.updateOrganisationAccount(accountId, accountUpdateDTO);

        assertThat(account.getName()).isEqualTo("newAccountName");
        assertThat(account.getClassificationCodes().get(0).getCode()).isEqualTo("newCode");
        assertThat(account.getAddress()).isEqualTo(address);
        verify(organisationAccountQueryService, times(1)).getAccountById(accountId);
    }

    private OrganisationAccountUpdateDTO createAccountUpdateDTO(ClassificationCodes codes) {
		return OrganisationAccountUpdateDTO.builder()
				.name("newAccountName")
				.codes(codes)
				.address(buildAddressDTO())
				.build();
	}
    
	private OrganisationAccount createAccount(Long accountId, String accountName) {
		return OrganisationAccount.builder()
			.id(accountId)
			.name(accountName)
			.registrationNumber("AB123456")
			.organisationId("orgId")
			.status(OrganisationAccountStatus.LIVE)
			.address(buildAddress())
			.build();
		}
    
    private CountyAddress buildAddress() {
		return CountyAddress.builder()
				.county("county")
				.line1("line1")
				.postcode("postcode")
				.city("city")
				.build();
	}
	
	private CountyAddressDTO buildAddressDTO() {
		return CountyAddressDTO.builder()
				.county("newCounty")
				.line1("newLine1")
				.postcode("newPostcode")
				.city("newCity")
				.build();
	}
}
