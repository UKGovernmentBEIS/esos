package uk.gov.esos.api.web.orchestrator.authorization.transform;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.core.domain.dto.UserAuthorityDTO;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.web.orchestrator.authorization.dto.UserAuthorityInfoDTO;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UserAuthorityInfoMapperTest {

    private UserAuthorityInfoMapper userAuthorityInfoMapper = Mappers.getMapper(UserAuthorityInfoMapper.class);

    @Test
    void toUserAuthorityInfo() {
        String userId = "userId";
        String roleName = "roleName";
        String roleCode = "roleName";
        AuthorityStatus authorityStatus = AuthorityStatus.ACTIVE;
        String firstName = "firstName";
        String lastName = "lastName";
        Boolean locked = false;

        UserAuthorityDTO userAuthority = UserAuthorityDTO.builder()
            .userId(userId)
            .roleName(roleName)
            .roleCode(roleCode)
            .authorityStatus(authorityStatus)
            .build();
        UserInfoDTO userInfoDTO = UserInfoDTO.builder()
            .userId(userId)
            .firstName(firstName)
            .lastName(lastName)
            .locked(locked)
            .build();

        UserAuthorityInfoDTO expectedDTO = UserAuthorityInfoDTO.builder()
            .userId(userId)
            .firstName(firstName)
            .lastName(lastName)
            .roleCode(roleCode)
            .roleName(roleName)
            .authorityStatus(authorityStatus)
            .locked(locked)
            .build();

        UserAuthorityInfoDTO actualDTO =
            userAuthorityInfoMapper.toUserAuthorityInfo(userAuthority, userInfoDTO);

        assertEquals(expectedDTO, actualDTO);
    }
}