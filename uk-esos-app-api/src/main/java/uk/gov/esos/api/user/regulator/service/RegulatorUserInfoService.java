package uk.gov.esos.api.user.regulator.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.services.resource.CompAuthAuthorizationResourceService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserInfoDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegulatorUserInfoService {

    private final CompAuthAuthorizationResourceService compAuthAuthorizationResourceService;
    private final UserAuthService userAuthService;

    public List<RegulatorUserInfoDTO> getRegulatorUsersInfo(AppUser user, List<String> userIds) {
        boolean hasEditUserScopeOnCa = compAuthAuthorizationResourceService.hasUserScopeToCompAuth(user, Scope.EDIT_USER);

        List<RegulatorUserInfoDTO> regulatorsUserInfo = userAuthService.getUsersWithAttributes(userIds, RegulatorUserInfoDTO.class);
        if(!hasEditUserScopeOnCa) {
            for (RegulatorUserInfoDTO regulatorUserInfo: regulatorsUserInfo) {
                regulatorUserInfo.setEnabled(null);
            }
        }
        return regulatorsUserInfo;
    }
}
