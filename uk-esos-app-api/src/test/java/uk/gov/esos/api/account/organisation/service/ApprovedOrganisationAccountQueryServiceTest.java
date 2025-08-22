package uk.gov.esos.api.account.organisation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import uk.gov.esos.api.account.domain.dto.AccountContactInfoDTO;
import uk.gov.esos.api.account.domain.enumeration.AccountContactType;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.organisation.repository.OrganisationAccountRepository;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApprovedOrganisationAccountQueryServiceTest {

    @InjectMocks
    private ApprovedOrganisationAccountQueryService service;

    @Mock
    private OrganisationAccountRepository organisationAccountRepository;

    @Test
    void getAllApprovedAccountIdsByCa() {
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.WALES;
        List<Long> expected = List.of(1L, 2L);

        when(organisationAccountRepository
            .findAccountIdsByCaAndStatusNotIn(competentAuthority, List.of(OrganisationAccountStatus.AWAITING_APPROVAL)))
            .thenReturn(expected);

        List<Long> actual = service.getAllApprovedAccountIdsByCa(competentAuthority);

        assertThat(actual).containsExactlyInAnyOrderElementsOf(expected);
    }

    @Test
    void getApprovedAccountsAndCaSiteContactsByCa() {
        int page = 1;
        int pageSize = 20;
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.SCOTLAND;
        AccountContactType caSiteContactType = AccountContactType.CA_SITE;
        List<AccountContactInfoDTO> expectedContacts = List.of(AccountContactInfoDTO.builder()
            .accountId(1L).accountName("name").userId("userId").build());
        Page<AccountContactInfoDTO> pagedAccountContacts = new PageImpl<>(expectedContacts);

        when(organisationAccountRepository
            .findAccountContactsByCaAndContactTypeAndStatusNotIn(PageRequest.of(page, pageSize), competentAuthority,
                caSiteContactType, List.of(OrganisationAccountStatus.AWAITING_APPROVAL)))
            .thenReturn(pagedAccountContacts);

        Page<AccountContactInfoDTO> actual =
            service.getApprovedAccountsAndCaSiteContactsByCa(competentAuthority, page, pageSize);

        assertThat(actual).containsExactlyInAnyOrderElementsOf(expectedContacts);
    }

    @Test
    void isAccountApproved() {
        OrganisationAccount account = OrganisationAccount.builder().status(OrganisationAccountStatus.AWAITING_APPROVAL).build();
        assertFalse(service.isAccountApproved(account));

        account.setStatus(OrganisationAccountStatus.LIVE);
        assertTrue(service.isAccountApproved(account));
    }

    @Test
    void getAccountType() {
        assertEquals(AccountType.ORGANISATION, service.getAccountType());
    }
}