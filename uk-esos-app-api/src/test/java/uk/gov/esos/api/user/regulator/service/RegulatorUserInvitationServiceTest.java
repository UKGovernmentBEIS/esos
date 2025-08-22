package uk.gov.esos.api.user.regulator.service;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.MANAGE_USERS_AND_CONTACTS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel.EXECUTE;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.regulator.service.RegulatorAuthorityService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.user.regulator.domain.RegulatorInvitedUserDTO;
import uk.gov.esos.api.user.regulator.domain.RegulatorInvitedUserDetailsDTO;

@ExtendWith(MockitoExtension.class)
class RegulatorUserInvitationServiceTest {

    @InjectMocks
    private RegulatorUserInvitationService service;

    @Mock
    private RegulatorAuthorityService regulatorAuthorityService;

    @Mock
    private RegulatorUserNotificationGateway regulatorUserNotificationGateway;

    @Mock
    private RegulatorUserAuthService regulatorUserAuthService;

    @Test
    void inviteUser() {
        String userId = "userId";
        CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        AppUser authUser = AppUser.builder()
            .userId("authUser")
            .roleType(RoleType.REGULATOR)
            .authorities(List.of(AppAuthority.builder().competentAuthority(ca).build()))
            .build();

        String authorityUuid = "uuid";
        RegulatorInvitedUserDTO regulatorInvitedUser = createInvitedUser();
        
        FileDTO signature = FileDTO.builder()
                .fileContent("content".getBytes())
                .fileName("signature")
                .fileSize(1L)
                .fileType("type")
                .build();

        when(regulatorUserAuthService.saveInvitedUser(regulatorInvitedUser.getUserDetails(), signature))
            .thenReturn(userId);
        when(regulatorAuthorityService
            .createRegulatorAuthorityPermissions(authUser, userId, ca, List.of(Permission.PERM_CA_USERS_EDIT)))
            .thenReturn(authorityUuid);

        //invoke
        service.inviteUser(regulatorInvitedUser,signature,  authUser);

        //verify
        verify(regulatorUserAuthService, times(1))
            .saveInvitedUser(regulatorInvitedUser.getUserDetails(), signature);
        verify(regulatorAuthorityService, times(1))
            .createRegulatorAuthorityPermissions(authUser, userId, ca, List.of(Permission.PERM_CA_USERS_EDIT));
        verify(regulatorUserNotificationGateway, times(1))
            .notifyInvitedUser(regulatorInvitedUser.getUserDetails(), authorityUuid);
    }

    private RegulatorInvitedUserDTO createInvitedUser() {
        RegulatorInvitedUserDTO invitedUser =
            RegulatorInvitedUserDTO.builder()
                .userDetails(RegulatorInvitedUserDetailsDTO.builder()
                    .firstName("fn")
                    .lastName("ln")
                    .email("em@em.gr")
                    .jobTitle("title")
                    .phoneNumber("210000")
                    .build())
                .permissions(Map.of(MANAGE_USERS_AND_CONTACTS, EXECUTE))
                .build();
        return invitedUser;
    }

}
