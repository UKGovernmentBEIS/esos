package uk.gov.esos.api.reporting.noc.phase3.service;

import lombok.RequiredArgsConstructor;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;

import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.common.domain.NocSearchCriteria;
import uk.gov.esos.api.reporting.noc.common.domain.NocSearchResults;
import uk.gov.esos.api.reporting.noc.common.repository.NocQueryCustomRepository;
import uk.gov.esos.api.reporting.noc.phase3.domain.dto.NocP3SearchResultsDto;
import uk.gov.esos.api.reporting.noc.phase3.transform.NocMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NocP3QueryService {

    private final List<NocQueryCustomRepository> nocQueryCustomRepositories;
    private final NocMapper nocMapper = Mappers.getMapper(NocMapper.class);

    public NocP3SearchResultsDto findAll(AccountType accountType, Long page, Long pageSize) {
        NocSearchCriteria criteria = NocSearchCriteria.builder()
                .accountType(accountType)
                .phase(Phase.PHASE_3)
                .paging(PagingRequest.builder()
                        .pageNumber(page)
                        .pageSize(pageSize)
                        .build())
                .build();

        NocSearchResults searchResults = nocQueryCustomRepositories.stream()
                .filter(nocQueryCustomRepository -> nocQueryCustomRepository.getAccountType().equals(criteria.getAccountType()))
                .findFirst()
                .map(nocQueryCustomRepository -> nocQueryCustomRepository.findAll(criteria))
                .orElse(NocSearchResults.builder().nocSearchResultsInfos(List.of()).total(0L).build());

        return nocMapper.toNocP3SearchResultsDto(searchResults);
    }
}
