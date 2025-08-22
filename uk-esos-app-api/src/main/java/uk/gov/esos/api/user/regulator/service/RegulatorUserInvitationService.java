package uk.gov.esos.api.user.regulator.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.regulator.service.RegulatorAuthorityService;
import uk.gov.esos.api.authorization.regulator.transform.RegulatorPermissionsAdapter;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.user.regulator.domain.RegulatorInvitedUserDTO;

@Log4j2
@Service
@RequiredArgsConstructor
public class RegulatorUserInvitationService {

    private final RegulatorAuthorityService regulatorAuthorityService;
    private final RegulatorUserNotificationGateway regulatorUserNotificationGateway;
    private final RegulatorUserAuthService regulatorUserAuthService;
    
    @Transactional
    public void inviteUser(RegulatorInvitedUserDTO regulatorInvitedUser, FileDTO signature, AppUser authUser) {
        //save invited user
        final String userId = regulatorUserAuthService.saveInvitedUser(regulatorInvitedUser.getUserDetails(), signature);

        //create authorities for invited user
        String authorityUuid = regulatorAuthorityService.createRegulatorAuthorityPermissions(
            authUser,
            userId,
            authUser.getCompetentAuthority(),
            RegulatorPermissionsAdapter.getPermissionsFromPermissionGroupLevels(regulatorInvitedUser.getPermissions()));

        //send invitation email
        regulatorUserNotificationGateway.notifyInvitedUser(regulatorInvitedUser.getUserDetails(), authorityUuid);
    }

}
