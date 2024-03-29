package uk.gov.esos.api.user.verifier.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.rules.domain.Scope;
import uk.gov.esos.api.authorization.rules.services.resource.VerificationBodyAuthorizationResourceService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.service.UserInfoService;

@ExtendWith(MockitoExtension.class)
class VerifierUserInfoServiceTest {

    @InjectMocks
    private VerifierUserInfoService verifierUserInfoService;

    @Mock
    private VerificationBodyAuthorizationResourceService verificationBodyAuthorizationResourceService;

    @Mock
    private UserInfoService userInfoService;

    @Test
    void getVerifierUsersInfo() {
        AppUser authUser = new AppUser();
        Long vbId = 1L;
        List<UserInfoDTO> expectedUserInfoList = List.of(UserInfoDTO.builder()
            .locked(false)
            .firstName("firstName")
            .lastName("lastName")
            .build());
        boolean hasUserScopeToVb = true;

        when(verificationBodyAuthorizationResourceService.hasUserScopeToVerificationBody(authUser, vbId, Scope.EDIT_USER))
            .thenReturn(hasUserScopeToVb);
        when(userInfoService.getUsersInfo(List.of("userId"), hasUserScopeToVb)).thenReturn(expectedUserInfoList);

        List<UserInfoDTO> actualUserInfoList = verifierUserInfoService.getVerifierUsersInfo(authUser, vbId, List.of("userId"));

        assertEquals(expectedUserInfoList, actualUserInfoList);
    }
}