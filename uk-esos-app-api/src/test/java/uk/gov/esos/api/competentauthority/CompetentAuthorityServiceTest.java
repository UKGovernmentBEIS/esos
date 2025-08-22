package uk.gov.esos.api.competentauthority;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.domain.CompetentAuthority;
import uk.gov.esos.api.competentauthority.repository.CompetentAuthorityRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CompetentAuthorityServiceTest {

	@InjectMocks
    private CompetentAuthorityService competentAuthorityService;

    @Mock
    private CompetentAuthorityRepository competentAuthorityRepository;
	@Mock
	private CompetentAuthorityMapper competentAuthorityMapper;

	@Test
    void exclusiveLockCompetentAuthority() {
    	CompetentAuthorityEnum competentAuthorityEnum = CompetentAuthorityEnum.ENGLAND;
		CompetentAuthority ca = CompetentAuthority.builder()
				.id(competentAuthorityEnum)
				.email("email")
				.name("name")
				.build();
		CompetentAuthorityDTO caDTO = CompetentAuthorityDTO.builder().id(competentAuthorityEnum).email("email").name("name").build();

		when(competentAuthorityRepository.findByIdForUpdate(competentAuthorityEnum)).thenReturn(Optional.of(ca));
		when(competentAuthorityMapper.toCompetentAuthorityDTO(ca)).thenReturn(caDTO);

		CompetentAuthorityDTO result = competentAuthorityService.exclusiveLockCompetentAuthority(competentAuthorityEnum);
		
		assertThat(result).isEqualTo(CompetentAuthorityDTO.builder().id(competentAuthorityEnum).build());
		
		verify(competentAuthorityRepository, times(1)).findByIdForUpdate(competentAuthorityEnum);
    }

	@Test
	void getCompetentAuthority() {
		AccountType accountType = AccountType.ORGANISATION;
		CompetentAuthorityEnum competentAuthorityEnum = CompetentAuthorityEnum.ENGLAND;
		CompetentAuthority ca = CompetentAuthority.builder()
				.id(competentAuthorityEnum)
				.email("email")
				.name("name")
				.build();
		CompetentAuthorityDTO caDTO = CompetentAuthorityDTO.builder().id(competentAuthorityEnum).email("email").name("name").build();

		when(competentAuthorityRepository.findById(competentAuthorityEnum)).thenReturn(Optional.of(ca));
		when(competentAuthorityMapper.toCompetentAuthorityDTO(ca, accountType)).thenReturn(caDTO);

		CompetentAuthorityDTO result = competentAuthorityService.getCompetentAuthority(competentAuthorityEnum, accountType);

		assertThat(result).isEqualTo(CompetentAuthorityDTO.builder().id(competentAuthorityEnum).build());

		verify(competentAuthorityRepository, times(1)).findById(competentAuthorityEnum);
	}
}
