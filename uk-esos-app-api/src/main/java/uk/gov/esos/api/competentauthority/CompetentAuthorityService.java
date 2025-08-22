package uk.gov.esos.api.competentauthority;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.competentauthority.domain.CompetentAuthority;
import uk.gov.esos.api.competentauthority.repository.CompetentAuthorityRepository;

import java.io.IOException;

import static uk.gov.esos.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
@Log4j2
public class CompetentAuthorityService {

    private final CompetentAuthorityRepository competentAuthorityRepository;
    private final CompetentAuthorityMapper competentAuthorityMapper;

    public CompetentAuthorityDTO exclusiveLockCompetentAuthority(CompetentAuthorityEnum competentAuthorityEnum) {
        return competentAuthorityRepository.findByIdForUpdate(competentAuthorityEnum)
                .map(competentAuthorityMapper::toCompetentAuthorityDTO)
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
    }

    public CompetentAuthorityDTO getCompetentAuthority(CompetentAuthorityEnum competentAuthorityEnum, AccountType accountType) {
        return competentAuthorityMapper
                .toCompetentAuthorityDTO(getCompetentAuthority(competentAuthorityEnum), accountType);
    }

    public static byte[] getCompetentAuthorityLogo(CompetentAuthorityEnum competentAuthority) {
        try {
            return new ClassPathResource("images/ca/" + competentAuthority.getLogoPath()).getInputStream().readAllBytes();
        } catch (IOException e) {
            log.error(e.getMessage());
            throw new BusinessException(ErrorCode.INTERNAL_SERVER);
        }
    }
    
	private CompetentAuthority getCompetentAuthority(CompetentAuthorityEnum competentAuthorityEnum) {
		return competentAuthorityRepository.findById(competentAuthorityEnum)
				.orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
	}
}
