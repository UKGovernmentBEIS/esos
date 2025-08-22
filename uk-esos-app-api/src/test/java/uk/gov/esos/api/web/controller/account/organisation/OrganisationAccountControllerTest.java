package uk.gov.esos.api.web.controller.account.organisation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uk.gov.esos.api.account.domain.dto.AccountSearchCriteria;
import uk.gov.esos.api.account.organisation.domain.dto.AccountSearchResults;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountQueryService;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountValidationService;
import uk.gov.esos.api.authorization.core.domain.AppUser;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountControllerTest {

    @InjectMocks
    OrganisationAccountController controller;

    @Mock
    OrganisationAccountQueryService organisationAccountQueryService;

    @Mock
    OrganisationAccountValidationService organisationAccountValidationService;

    @Test
    void getCurrentUserOrganisationAccounts(){
        AppUser mockUser = Mockito.mock(AppUser.class);
        AccountSearchResults expectedResults = AccountSearchResults.builder().accounts(List.of()).total(10L).build();

        when(this.organisationAccountQueryService.getAccountsByUserAndSearchCriteria(any(AppUser.class), any(AccountSearchCriteria.class)))
                .thenReturn(expectedResults);

        ResponseEntity<AccountSearchResults> results = this.controller.getCurrentUserOrganisationAccounts(mockUser, "AAA", 0L, 10L);
        assertNotNull(results);
        assertEquals(HttpStatus.OK, results.getStatusCode());
        assertEquals(expectedResults, results.getBody());

        verify(this.organisationAccountQueryService).getAccountsByUserAndSearchCriteria(any(),any());
    }

    @Test
    void isExistingAccountRegistrationNumber() {
        String registrationNbr = "registrationNbr";

        when(organisationAccountValidationService.isExistingActiveAccountRegistrationNumber(registrationNbr))
            .thenReturn(true);

        ResponseEntity<Boolean> response =
            controller.isExistingAccountRegistrationNumber(registrationNbr);

        // Verify
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Boolean.TRUE, response.getBody());

        verify(organisationAccountValidationService, times(1))
            .isExistingActiveAccountRegistrationNumber(registrationNbr);
    }

}
