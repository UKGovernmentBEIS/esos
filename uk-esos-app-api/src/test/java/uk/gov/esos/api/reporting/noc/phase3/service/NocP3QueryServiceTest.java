package uk.gov.esos.api.reporting.noc.phase3.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.common.domain.NocSearchCriteria;
import uk.gov.esos.api.reporting.noc.common.domain.NocSearchResults;
import uk.gov.esos.api.reporting.noc.common.domain.NocSearchResultsInfo;
import uk.gov.esos.api.reporting.noc.common.repository.NocQueryCustomRepository;
import uk.gov.esos.api.reporting.noc.common.repository.NocQueryOrganisationCustomRepository;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.dto.NocP3SearchResultsDto;
import uk.gov.esos.api.reporting.noc.phase3.domain.dto.NocP3SearchResultsInfoDto;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3QueryServiceTest {

    @InjectMocks
    private NocP3QueryService nocP3QueryService;

    @Spy
    private ArrayList<NocQueryCustomRepository> nocQueryCustomRepositories;

    @Mock
    private NocQueryOrganisationCustomRepository nocQueryOrganisationCustomRepository;

    @BeforeEach
    void setup() {
        nocQueryCustomRepositories.add(nocQueryOrganisationCustomRepository);
    }

    @Test
    void findAll() {
        final AccountType accountType = AccountType.ORGANISATION;
        final long page = 0;
        final long pageSize = 10;
        final long total = 1L;
        final String nocId = "NOC001";
        final NocSearchCriteria criteria = NocSearchCriteria.builder()
                .accountType(accountType)
                .phase(Phase.PHASE_3)
                .paging(PagingRequest.builder()
                        .pageNumber(page)
                        .pageSize(pageSize)
                        .build())
                .build();

        final NocSearchResults searchResults = NocSearchResults.builder()
                .nocSearchResultsInfos(List.of(
                        NocSearchResultsInfo.builder()
                                .id(nocId)
                                .organisationName("Organisation")
                                .registrationNumber("number")
                                .location(CompetentAuthorityEnum.ENGLAND)
                                .nocContainer(NocP3Container.builder().noc(NocP3.builder().build()).build())
                                .build()
                ))
                .total(total)
                .build();
        NocP3SearchResultsDto expected = NocP3SearchResultsDto.builder()
                .nocSearchResultsInfos(List.of(
                        NocP3SearchResultsInfoDto.builder()
                                .id(nocId)
                                .organisationName("Organisation")
                                .registrationNumber("number")
                                .location(CompetentAuthorityEnum.ENGLAND)
                                .noc(NocP3.builder().build()).build()
                ))
                .total(total)
                .build();

        when(nocQueryOrganisationCustomRepository.getAccountType()).thenReturn(accountType);
        when(nocQueryOrganisationCustomRepository.findAll(criteria)).thenReturn(searchResults);

        // Invoke
        NocP3SearchResultsDto actual = nocP3QueryService.findAll(accountType, page, pageSize);

        // Verify
        assertThat(actual).isEqualTo(expected);
        verify(nocQueryOrganisationCustomRepository, times(1)).getAccountType();
        verify(nocQueryOrganisationCustomRepository, times(1)).findAll(criteria);
    }
}
