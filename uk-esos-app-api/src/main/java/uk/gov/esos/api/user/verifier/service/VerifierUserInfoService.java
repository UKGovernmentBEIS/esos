package uk.gov.esos.api.user.verifier.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.services.resource.VerificationBodyAuthorizationResourceService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.service.UserInfoService;

@Service
@RequiredArgsConstructor
public class VerifierUserInfoService {

    private final VerificationBodyAuthorizationResourceService verificationBodyAuthorizationResourceService;
    private final UserInfoService userInfoService;

    public List<UserInfoDTO> getVerifierUsersInfo(AppUser authUser, Long vbId, List<String> userIds) {
        boolean hasEditUserScopeOnVerificationBody = verificationBodyAuthorizationResourceService
            .hasUserScopeToVerificationBody(authUser, vbId, Scope.EDIT_USER);
        return userInfoService.getUsersInfo(userIds, hasEditUserScopeOnVerificationBody);
    }

    public List<UserInfoDTO> getVerifierUserInfo(List<String> userIds) {
        return userInfoService.getUsersInfo(userIds, true);
    }
}
