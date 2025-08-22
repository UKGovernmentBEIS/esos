package uk.gov.esos.api.account.organisation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.repository.OrganisationAccountRepository;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.ClassificationType;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountCreateServiceTest {

    @InjectMocks
    private OrganisationAccountCreateService service;

    @Mock
    private OrganisationAccountRepository organisationAccountRepository;

    @Mock
    private OrganisationAccountValidationService organisationAccountValidationService;

    @Test
    void createOrganisationAccount() {
        Long accountId = 10L;
        String registrationNbr = "registrationNbr";
        OrganisationAccountDTO accountCreationDTO = OrganisationAccountDTO.builder()
                .name("name")
                .status(OrganisationAccountStatus.LIVE)
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .registrationNumber(registrationNbr)
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .codes(ClassificationCodes.builder().type(ClassificationType.SIC).codes(List.of("sicCode")).build())
                .build();

        when(organisationAccountRepository.generateId()).thenReturn(accountId);
        when(organisationAccountRepository.save(ArgumentMatchers.any(OrganisationAccount.class)))
            .then(invocationOnMock -> invocationOnMock.getArgument(0));

        //invoke
        OrganisationAccountDTO response = service.createOrganisationAccount(accountCreationDTO);

        //verify
        assertEquals("ORG000010", response.getOrganisationId());
        assertEquals(accountCreationDTO.getRegistrationNumber(), response.getRegistrationNumber());
        assertEquals(accountCreationDTO.getName(), response.getName());
        assertEquals(accountCreationDTO.getCompetentAuthority(), response.getCompetentAuthority());
        assertEquals(accountCreationDTO.getAddress(), response.getAddress());
        assertEquals(OrganisationAccountStatus.AWAITING_APPROVAL, response.getStatus());

        verify(organisationAccountValidationService, times(1)).validateActiveAccountRegistrationNumberExistence(registrationNbr);
        verify(organisationAccountRepository, times(1)).generateId();
        verify(organisationAccountRepository, times(1)).save(ArgumentMatchers.any(OrganisationAccount.class));
    }

    @Test
    void createOrganisationAccount_throws_exception_when_invalid_registration_nbr() {
        String registrationNbr = "registrationNbr";
        OrganisationAccountDTO accountCreationDTO = OrganisationAccountDTO.builder()
            .name("name")
            .status(OrganisationAccountStatus.LIVE)
            .address(CountyAddressDTO.builder()
                .line1("line1")
                .line2("line2")
                .city("city")
                .county("county")
                .postcode("postcode")
                .build())
            .registrationNumber(registrationNbr)
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .build();

        doThrow(new BusinessException(ErrorCode.ACCOUNT_REGISTRATION_NUMBER_ALREADY_EXISTS, registrationNbr))
            .when(organisationAccountValidationService).validateActiveAccountRegistrationNumberExistence(registrationNbr);

        // Invoke
        BusinessException ex = assertThrows(BusinessException.class, () -> service.createOrganisationAccount(accountCreationDTO));

        // Verify
        assertEquals(ErrorCode.ACCOUNT_REGISTRATION_NUMBER_ALREADY_EXISTS, ex.getErrorCode());
        assertThat(ex.getData()).isEqualTo(new Object[]{registrationNbr});

        verify(organisationAccountValidationService, times(1)).validateActiveAccountRegistrationNumberExistence(registrationNbr);
        verifyNoInteractions(organisationAccountRepository);
    }
}