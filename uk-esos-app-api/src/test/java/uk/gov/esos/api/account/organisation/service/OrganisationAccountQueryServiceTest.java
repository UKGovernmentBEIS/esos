package uk.gov.esos.api.account.organisation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.domain.dto.AccountSearchCriteria;
import uk.gov.esos.api.account.organisation.domain.ClassificationCode;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.organisation.domain.dto.AccountSearchResults;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.repository.OrganisationAccountRepository;
import uk.gov.esos.api.account.service.VerifierAccountAccessByAccountTypeService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.services.resource.AccountAuthorizationResourceService;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.ClassificationType;
import uk.gov.esos.api.common.domain.CountyAddress;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountQueryServiceTest {

    @InjectMocks
    private OrganisationAccountQueryService service;

    @Mock
    private OrganisationAccountRepository repository;

    @Mock
    private VerifierAccountAccessByAccountTypeService verifierAccountAccessService;
    
    @Mock
    private AccountAuthorizationResourceService accountAuthorizationResourceService;


    @Test
    void getAccountsByUserAndSearchCriteria_when_userIsOperator() {
        AppUser mockUser = mock(AppUser.class);
        AccountSearchCriteria criteria = new AccountSearchCriteria("AAA", new PagingRequest(1L, 10L));
        AccountSearchResults expectedResults = AccountSearchResults.builder().accounts(List.of()).total(10L).build();

        when(mockUser.getRoleType()).thenReturn(RoleType.OPERATOR);
        when(mockUser.getAccounts()).thenReturn(Set.of(1L, 2L));
        when(this.repository.findByAccountIds(anyList(), eq(criteria))).thenReturn(expectedResults);

        AccountSearchResults results = this.service.getAccountsByUserAndSearchCriteria(mockUser, criteria);

        assertEquals(expectedResults, results);
        verify(this.repository).findByAccountIds(anyList(), eq(criteria));
    }

    @Test
    void getAccountsByUserAndSearchCriteria_when_userIsRegulator() {
        AppUser mockUser = mock(AppUser.class);
        AccountSearchCriteria criteria = new AccountSearchCriteria("AAA", new PagingRequest(1L, 10L));
        AccountSearchResults expectedResults = AccountSearchResults.builder().accounts(List.of()).total(10L).build();

        when(mockUser.getRoleType()).thenReturn(RoleType.REGULATOR);
        when(mockUser.getCompetentAuthority()).thenReturn(CompetentAuthorityEnum.ENGLAND);
        when(this.repository.findByCompAuth(mockUser.getCompetentAuthority(), criteria)).thenReturn(expectedResults);

        AccountSearchResults results = this.service.getAccountsByUserAndSearchCriteria(mockUser, criteria);

        assertEquals(expectedResults, results);
        verify(this.repository).findByCompAuth(mockUser.getCompetentAuthority(), criteria);
    }

    @Test
    void getAccountsByUserAndSearchCriteria_when_userIsVerifier() {
        AppUser mockUser = mock(AppUser.class);
        AccountSearchCriteria criteria = new AccountSearchCriteria("AAA", new PagingRequest(1L, 10L));
        AccountSearchResults expectedResults = AccountSearchResults.builder().accounts(List.of()).total(10L).build();

        when(mockUser.getRoleType()).thenReturn(RoleType.VERIFIER);
        when(this.verifierAccountAccessService.findAuthorizedAccountIds(mockUser, AccountType.ORGANISATION)).thenReturn(Set.of(1L));
        when(repository.findByAccountIds(List.of(1L), criteria)).thenReturn(expectedResults);
        AccountSearchResults results = this.service.getAccountsByUserAndSearchCriteria(mockUser, criteria);

        assertEquals(expectedResults, results);
        verify(this.repository).findByAccountIds(List.of(1L), criteria);
    }

    @Test
    void getAccountsByUserAndSearchCriteria_when_userIsVerifier_no_accounts() {
        AppUser mockUser = mock(AppUser.class);
        AccountSearchCriteria criteria = new AccountSearchCriteria("AAA", new PagingRequest(1L, 10L));
        AccountSearchResults expectedResults = AccountSearchResults.builder().accounts(List.of()).total(0L).build();

        when(mockUser.getRoleType()).thenReturn(RoleType.VERIFIER);
        when(this.verifierAccountAccessService.findAuthorizedAccountIds(mockUser, AccountType.ORGANISATION)).thenReturn(Set.of());
        AccountSearchResults results = this.service.getAccountsByUserAndSearchCriteria(mockUser, criteria);

        assertEquals(expectedResults, results);
        verify(this.repository, never()).findByAccountIds(any(), any());
    }

    @Test
    void getOrganisationAccountById() {
        final long accountId = 1L;
        final OrganisationAccount account = OrganisationAccount.builder()
                .id(accountId)
                .registrationNumber("registrationNbr")
                .name("accName")
                .address(CountyAddress.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .organisationId(String.valueOf(accountId))
                .status(OrganisationAccountStatus.LIVE)
                .classificationCodes(List.of(ClassificationCode.builder().type(ClassificationType.SIC).code("sicCode").build()))
                .location(CompetentAuthorityEnum.WALES)
                .build();
        final OrganisationAccountDTO expected = OrganisationAccountDTO.builder()
                .id(accountId)
                .registrationNumber("registrationNbr")
                .name("accName")
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .competentAuthority(CompetentAuthorityEnum.WALES)
                .organisationId(String.valueOf(accountId))
                .status(OrganisationAccountStatus.LIVE)
                .codes(ClassificationCodes.builder().type(ClassificationType.SIC).codes(List.of("sicCode")).build())
                .build();

        when(repository.findById(accountId)).thenReturn(Optional.of(account));

        // Invoke
        OrganisationAccountDTO actual = service.getOrganisationAccountById(accountId);

        // Verify
        assertThat(actual).isEqualTo(expected);
        verify(repository, times(1)).findById(accountId);
    }
    
    @Test
    void getOrganisationAccount() {
        final long accountId = 1L;
        final AppUser user = AppUser.builder().userId("userId").roleType(RoleType.OPERATOR).build();
        final OrganisationAccount account = OrganisationAccount.builder()
                .id(accountId)
                .registrationNumber("registrationNbr")
                .name("accName")
                .address(CountyAddress.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .organisationId(String.valueOf(accountId))
                .status(OrganisationAccountStatus.LIVE)
                .classificationCodes(List.of(ClassificationCode.builder().type(ClassificationType.SIC).code("sicCode").build()))
                .location(CompetentAuthorityEnum.WALES)
                .build();
        final OrganisationAccountDTO expected = OrganisationAccountDTO.builder()
                .id(accountId)
                .registrationNumber("registrationNbr")
                .name("accName")
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .competentAuthority(CompetentAuthorityEnum.WALES)
                .organisationId(String.valueOf(accountId))
                .status(OrganisationAccountStatus.LIVE)
                .codes(ClassificationCodes.builder().type(ClassificationType.SIC).codes(List.of("sicCode")).build())
                .editable(false)
                .build();

        when(repository.findById(accountId)).thenReturn(Optional.of(account));

        // Invoke
        OrganisationAccountDTO actual = service.getOrganisationAccount(user, accountId);

        // Verify
        assertThat(actual).isEqualTo(expected);
        verify(repository, times(1)).findById(accountId);
        verify(accountAuthorizationResourceService, times(1)).hasUserScopeToAccount(user, accountId, Scope.EDIT_ACCOUNT_DETAILS);
    }

    @Test
    void getOrganisationAccount_Expected_Editable_False() {
        final long accountId = 1L;
        final AppUser user = AppUser.builder().userId("userId").roleType(RoleType.OPERATOR).build();
        final OrganisationAccount account = OrganisationAccount.builder()
                .id(accountId)
                .registrationNumber("registrationNbr")
                .name("accName")
                .address(CountyAddress.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .organisationId(String.valueOf(accountId))
                .status(OrganisationAccountStatus.CLOSED)
                .classificationCodes(List.of(ClassificationCode.builder().type(ClassificationType.SIC).code("sicCode").build()))
                .location(CompetentAuthorityEnum.WALES)
                .build();
        final OrganisationAccountDTO expected = OrganisationAccountDTO.builder()
                .id(accountId)
                .registrationNumber("registrationNbr")
                .name("accName")
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .competentAuthority(CompetentAuthorityEnum.WALES)
                .organisationId(String.valueOf(accountId))
                .status(OrganisationAccountStatus.CLOSED)
                .codes(ClassificationCodes.builder().type(ClassificationType.SIC).codes(List.of("sicCode")).build())
                .editable(false) // Assuming the user has scope and the account is not CLOSED
                .build();

        when(repository.findById(accountId)).thenReturn(Optional.of(account));
        when(accountAuthorizationResourceService.hasUserScopeToAccount(user, accountId, Scope.EDIT_ACCOUNT_DETAILS))
                .thenReturn(true);

        // Invoke
        OrganisationAccountDTO actual = service.getOrganisationAccount(user, accountId);

        // Verify
        assertThat(actual).isEqualTo(expected);
        verify(repository, times(1)).findById(accountId);
        verify(accountAuthorizationResourceService, times(1)).hasUserScopeToAccount(user, accountId, Scope.EDIT_ACCOUNT_DETAILS);
    }

    @Test
    void getAccountsByIds() {
        Long accountId = 1L;
        List<Long> accountIds = List.of(accountId);
        OrganisationAccount organisationAccount = OrganisationAccount.builder()
            .id(accountId)
            .name("accName")
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .organisationId(String.valueOf(accountId))
            .registrationNumber("registrationNbr")
            .status(OrganisationAccountStatus.LIVE)
            .location(CompetentAuthorityEnum.WALES)
            .build();

        when(repository.findAllByIdIn(accountIds)).thenReturn(List.of(organisationAccount));

        OrganisationAccountDTO organisationAccountDTO = OrganisationAccountDTO.builder()
            .id(accountId)
            .name("accName")
            .competentAuthority(CompetentAuthorityEnum.WALES)
            .organisationId(String.valueOf(accountId))
            .registrationNumber("registrationNbr")
            .status(OrganisationAccountStatus.LIVE)
            .build();

        //invoke
        List<OrganisationAccountDTO> actualList = service.getAccountsByIds(accountIds);


        //verify
        assertThat(actualList).containsExactly(organisationAccountDTO);
    }

}