package uk.gov.esos.api.authorization.regulator.transform;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.authorization.core.domain.dto.UserAuthorityDTO;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserInfoDTO;
import uk.gov.esos.api.web.orchestrator.authorization.dto.RegulatorUserAuthorityInfoDTO;
import uk.gov.esos.api.web.orchestrator.authorization.transform.RegulatorUserAuthorityInfoMapper;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static uk.gov.esos.api.authorization.core.domain.AuthorityStatus.ACTIVE;

class RegulatorUserAuthorityInfoMapperTest {

    private RegulatorUserAuthorityInfoMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = Mappers.getMapper(RegulatorUserAuthorityInfoMapper.class);
    }

    @Test
    void toCaRegulatorUserManageDTO() {

        UserAuthorityDTO authority = UserAuthorityDTO.builder().userId("userId").authorityStatus(ACTIVE).authorityCreationDate(LocalDateTime.now()).build();
        RegulatorUserInfoDTO regulatorUserInfoDTO = RegulatorUserInfoDTO.builder()
            .id("userId")
            .firstName("firstName")
            .lastName("lastName")
            .jobTitle("jobTitle")
            .build();

        RegulatorUserAuthorityInfoDTO result = mapper.toUserAuthorityInfo(authority, regulatorUserInfoDTO);

        assertThat(result.getUserId()).isEqualTo(regulatorUserInfoDTO.getId());
        assertThat(result.getFirstName()).isEqualTo(regulatorUserInfoDTO.getFirstName());
        assertThat(result.getLastName()).isEqualTo(regulatorUserInfoDTO.getLastName());
        assertThat(result.getJobTitle()).isEqualTo(regulatorUserInfoDTO.getJobTitle());
        assertThat(result.getAuthorityCreationDate()).isEqualTo(authority.getAuthorityCreationDate());
    }

    @Test
    void toCaEditableRegulatorUserManageDTO() {
        UserAuthorityDTO authority = UserAuthorityDTO.builder().userId("userId").authorityStatus(ACTIVE).authorityCreationDate(LocalDateTime.now()).build();
        RegulatorUserInfoDTO regulatorUserInfoDTO = RegulatorUserInfoDTO.builder()
            .id("userId")
            .firstName("firstName")
            .lastName("lastName")
            .jobTitle("jobTitle")
            .enabled(true)
            .build();

        RegulatorUserAuthorityInfoDTO result = mapper.toUserAuthorityInfo(authority, regulatorUserInfoDTO);

        assertThat(result.getUserId()).isEqualTo(regulatorUserInfoDTO.getId());
        assertThat(result.getFirstName()).isEqualTo(regulatorUserInfoDTO.getFirstName());
        assertThat(result.getLastName()).isEqualTo(regulatorUserInfoDTO.getLastName());
        assertThat(result.getJobTitle()).isEqualTo(regulatorUserInfoDTO.getJobTitle());
        assertThat(result.getAuthorityCreationDate()).isEqualTo(authority.getAuthorityCreationDate());
        assertThat(result.getAuthorityStatus()).isEqualTo(authority.getAuthorityStatus());
        assertThat(result.getLocked()).isEqualTo(!regulatorUserInfoDTO.getEnabled());
    }
}