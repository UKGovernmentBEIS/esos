package uk.gov.esos.api.web.orchestrator.authorization.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.dto.UserAuthoritiesDTO;
import uk.gov.esos.api.authorization.core.domain.dto.UserAuthorityDTO;
import uk.gov.esos.api.authorization.verifier.service.VerifierAuthorityQueryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.verifier.service.VerifierUserInfoService;
import uk.gov.esos.api.web.orchestrator.authorization.dto.UserAuthorityInfoDTO;
import uk.gov.esos.api.web.orchestrator.authorization.dto.UsersAuthoritiesInfoDTO;
import uk.gov.esos.api.web.orchestrator.authorization.transform.UserAuthorityInfoMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VerifierUserAuthorityQueryOrchestrator {

    private final VerifierAuthorityQueryService verifierAuthorityQueryService;
    private final VerifierUserInfoService verifierUserInfoService;
    private final UserAuthorityInfoMapper userAuthorityInfoMapper = Mappers.getMapper(UserAuthorityInfoMapper.class);

    public UsersAuthoritiesInfoDTO getVerifierUsersAuthoritiesInfo(AppUser authUser) {
        UserAuthoritiesDTO verifierAuthorities  = verifierAuthorityQueryService.getVerifierAuthorities(authUser);
        List<String> userIds = verifierAuthorities.getAuthorities().stream().map(UserAuthorityDTO::getUserId).collect(Collectors.toList());
        List<UserInfoDTO> verifierUserInfoList = verifierUserInfoService
            .getVerifierUsersInfo(authUser, authUser.getVerificationBodyId(), userIds);

        return getVerifierUsersAuthoritiesInfo(verifierAuthorities, verifierUserInfoList);
    }

    public UsersAuthoritiesInfoDTO getVerifierAuthoritiesByVerificationBodyId(Long verificationBodyId) {
        UserAuthoritiesDTO verifierAuthorities  = verifierAuthorityQueryService
            .getVerificationBodyAuthorities(verificationBodyId, true);
        List<String> userIds = verifierAuthorities.getAuthorities().stream().map(UserAuthorityDTO::getUserId).collect(Collectors.toList());
        List<UserInfoDTO> verifierUserInfoList = verifierUserInfoService.getVerifierUserInfo(userIds);
        return getVerifierUsersAuthoritiesInfo(verifierAuthorities, verifierUserInfoList);
    }

    private UsersAuthoritiesInfoDTO getVerifierUsersAuthoritiesInfo(UserAuthoritiesDTO userAuthorities,
                                                                    List<UserInfoDTO> verifierUserInfoList) {

        List<UserAuthorityInfoDTO> verifierUserAuthorities =
            userAuthorities.getAuthorities().stream()
                .map(authority ->
                    userAuthorityInfoMapper.toUserAuthorityInfo(
                        authority,
                        verifierUserInfoList.stream()
                            .filter(info -> info.getUserId().equals(authority.getUserId()))
                            .findFirst()
                            .orElse(new UserInfoDTO())))
                .collect(Collectors.toList());

        return UsersAuthoritiesInfoDTO.builder()
            .authorities(verifierUserAuthorities)
            .editable(userAuthorities.isEditable())
            .build();
    }

}
