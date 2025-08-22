package uk.gov.esos.api.user.core.service.auth;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.representations.idm.UserSessionRepresentation;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.esos.api.mireport.common.accountuserscontacts.OperatorUserInfoDTO;
import uk.gov.esos.api.common.config.KeycloakProperties;
import uk.gov.esos.api.user.core.domain.enumeration.KeycloakUserAttributes;
import uk.gov.esos.api.user.core.domain.model.UserDetails;
import uk.gov.esos.api.user.core.domain.model.UserDetailsRequest;
import uk.gov.esos.api.user.core.domain.model.UserInfo;
import uk.gov.esos.api.user.core.domain.model.core.SignatureRequest;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserInfoDTO;

import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus.PENDING;
import static uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus.REGISTERED;
import static uk.gov.esos.api.user.core.domain.enumeration.KeycloakUserAttributes.USER_STATUS;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    private static final String REALM = "realm";

    @InjectMocks
    private AuthService authService;

    @Mock
    private Keycloak keycloakAdminClient;

    @Mock
    private KeycloakCustomClient keycloakCustomClient;

    @Mock
    private KeycloakProperties keycloakProperties;

    @Mock
    private RealmResource realmResource;

    @Mock
    private UsersResource usersResource;

    @Mock
    private Response response;

    @Mock
    private UserResource userResource;

    @Spy
    private final Clock fixedClock = Clock.fixed(Instant.now(), ZoneId.of("UTC"));

    @Test
    void getUserRepresentationById() {
        String userId = "user";

        when(keycloakProperties.getRealm()).thenReturn(REALM);
        when(keycloakAdminClient.realm(REALM)).thenReturn(realmResource);
        when(realmResource.users()).thenReturn(usersResource);
        when(usersResource.get(userId)).thenReturn(userResource);

        authService.getUserRepresentationById(userId);

        verify(keycloakProperties, times(1)).getRealm();
        verify(keycloakAdminClient, times(1)).realm(REALM);
        verify(realmResource, times(1)).users();
        verify(usersResource, times(1)).get(userId);
        verify(userResource, times(1)).toRepresentation();
    }

    @Test
    void getUsers() {
        List<String> userIds = List.of("user1", "user2");
        List<UserInfo> userInfos = List.of(
            UserInfo.builder().id("user1").build(),
            UserInfo.builder().id("user2").build()
        );
        when(keycloakCustomClient.getUsers(userIds)).thenReturn(userInfos);

        List<UserInfo> result = authService.getUsers(userIds);

        verify(keycloakCustomClient, times(1)).getUsers(userIds);
        assertThat(result)
            .extracting(UserInfo::getId)
            .containsExactlyInAnyOrder("user1", "user2");
    }

    @Test
    void getUsersWithAttributes() {
        List<String> userIds = List.of("id1", "id2");
        List<RegulatorUserInfoDTO> expectedUsers =
            List.of(RegulatorUserInfoDTO.builder().id("id1").build(),
                RegulatorUserInfoDTO.builder().id("id2").build());

        when(keycloakCustomClient.getUsersWithAttributes(userIds, RegulatorUserInfoDTO.class))
            .thenReturn(expectedUsers);

        List<RegulatorUserInfoDTO> result = authService.getUsersWithAttributes(userIds, RegulatorUserInfoDTO.class);

        verify(keycloakCustomClient, times(1)).getUsersWithAttributes(userIds, RegulatorUserInfoDTO.class);
        assertThat(result)
            .extracting(RegulatorUserInfoDTO::getId)
            .containsExactlyInAnyOrder("id1", "id2");
    }

    @Test
    void getMiReportUsersWithAttributes() {
        List<String> userIds = List.of("id1", "id2");
        List<OperatorUserInfoDTO> expectedUsers = IntStream.range(1, 3)
            .mapToObj(i -> OperatorUserInfoDTO.builder()
                .firstName("name" + i)
                .lastLoginDate(DateTimeFormatter.ISO_DATE_TIME.format(LocalDateTime.now()))
                .build()
            )
            .collect(Collectors.toList());

        when(keycloakCustomClient.getUsersWithAttributes(userIds, OperatorUserInfoDTO.class))
            .thenReturn(expectedUsers);

        List<OperatorUserInfoDTO> result = authService.getUsersWithAttributes(userIds, OperatorUserInfoDTO.class);

        verify(keycloakCustomClient, times(1)).getUsersWithAttributes(userIds, OperatorUserInfoDTO.class);
        assertThat(result)
            .extracting(OperatorUserInfoDTO::getFirstName)
            .containsExactlyInAnyOrder("name1", "name2");
    }

    @Test
    void getUserDetails() {
        String userId = "userId";
        UserDetails userDetails = UserDetails.builder()
            .id(userId)
            .signature(FileInfoDTO.builder().uuid(UUID.randomUUID().toString()).name("sign").build())
            .build();

        when(keycloakCustomClient.getUserDetails(userId)).thenReturn(Optional.of(userDetails));

        Optional<UserDetails> result = authService.getUserDetails(userId);

        assertThat(result).isNotEmpty().contains(userDetails);
        verify(keycloakCustomClient, times(1)).getUserDetails(userId);
    }

    @Test
    void getUserSignature() {
        String signatureUuid = UUID.randomUUID().toString();
        FileDTO signature = FileDTO.builder()
            .fileContent("content".getBytes())
            .fileName("signature")
            .fileSize(1L)
            .fileType("type")
            .build();

        when(keycloakCustomClient.getUserSignature(signatureUuid)).thenReturn(Optional.of(signature));

        Optional<FileDTO> result = authService.getUserSignature(signatureUuid);

        assertThat(result).isNotEmpty().contains(signature);
        verify(keycloakCustomClient, times(1)).getUserSignature(signatureUuid);
    }

    @Test
    void updateUserTerms() {
        String userId = "user";
        Short currentTermsVersion = 1;
        Short newTermsVersion = 2;
        String email = "email@email";

        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setId(userId);
        userRepresentation.setEmail(email);
        userRepresentation.singleAttribute(KeycloakUserAttributes.TERMS_VERSION.getName(),
            String.valueOf(currentTermsVersion));

        mockGetUserResource(userId, userRepresentation);
        mockFindByEmail(List.of(userRepresentation), email);
        
        assertThat(userRepresentation.getAttributes().get(KeycloakUserAttributes.TERMS_VERSION.getName()).get(0))
            .isEqualTo(String.valueOf(currentTermsVersion));

        authService.updateUserTerms(userId, newTermsVersion);

        verifyGetUserResource(userId, 2);
        verifyFindByEmail(email);

        assertThat(userRepresentation.getAttributes().get(KeycloakUserAttributes.TERMS_VERSION.getName()).get(0))
            .isEqualTo(String.valueOf(newTermsVersion));
    }
    
    @Test
    void saveUser_update() {
        String userId = "user";
        String email = "email@email";
        final Map<String, List<String>> existingAttributes = new HashMap<>();
        existingAttributes.put("key1", List.of("val1"));
        existingAttributes.put("key2", List.of("val2"));

        UserRepresentation existingUserRepresentation = new UserRepresentation();
        existingUserRepresentation.setId(userId);
        existingUserRepresentation.setAttributes(existingAttributes);
        existingUserRepresentation.setEmail(email);

        final Map<String, List<String>> newAttributes = new HashMap<>();
        newAttributes.put("key2", List.of("val2_new"));
        newAttributes.put("key3", List.of("val3"));

        UserRepresentation newUserRepresentation = new UserRepresentation();
        newUserRepresentation.setId(userId);
        newUserRepresentation.setAttributes(newAttributes);
        newUserRepresentation.setEmail(email);

        mockFindByEmail(List.of(existingUserRepresentation), email);
        mockGetUserResource(userId, existingUserRepresentation);

        authService.saveUser(newUserRepresentation);

        verifyFindByEmail(email);
        verifyGetUserResource(userId);
        
        verify(keycloakProperties, times(2)).getRealm();
        verify(keycloakAdminClient, times(2)).realm(REALM);
        verify(realmResource, times(2)).users();
        
        ArgumentCaptor<UserRepresentation> userCaptor = ArgumentCaptor.forClass(UserRepresentation.class);

		verify(userResource, times(1)).update(userCaptor.capture());
		UserRepresentation userCaptured = userCaptor.getValue();
		assertThat(userCaptured.getAttributes()).containsExactlyInAnyOrderEntriesOf(Map.of(
				"key1", List.of("val1"),
				"key2", List.of("val2_new"),
				"key3", List.of("val3")
				));
    }

    @Test
    void saveUserDetails() throws UserDetailsSaveException {
        UserDetailsRequest userDetails = UserDetailsRequest.builder()
            .id("userId")
            .signature(
                SignatureRequest.builder().content("content".getBytes()).name("name").size(1L).type("type").build())
            .build();

        authService.saveUserDetails(userDetails);

        verify(keycloakCustomClient, times(1)).saveUserDetails(userDetails);
    }

    @Test
    void saveUserDetails_throws_UserDetailsSaveException() {
        UserDetailsRequest userDetails = UserDetailsRequest.builder()
            .id("userId")
            .signature(
                SignatureRequest.builder().content("content".getBytes()).name("name").size(1L).type("type").build())
            .build();

        doThrow(new RuntimeException("saving error")).when(keycloakCustomClient).saveUserDetails(userDetails);

        try {
            authService.saveUserDetails(userDetails);
            Assertions.fail("should not reach here");
        } catch (UserDetailsSaveException e) {
            assertThat(e.getCause().getMessage()).isEqualTo("saving error");
        } catch (Exception e) {
            Assertions.fail("should not throw different exception");
        }

        verify(keycloakCustomClient, times(1)).saveUserDetails(userDetails);
    }

    @Test
    void createUser() {
        final String userId = "userId";

        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setId(userId);

        //mock
        mockRegisterUser_created(userRepresentation, userId);

        //invoke
        String actualUserId = authService.createUser(userRepresentation);

        //verify mocks
        verify(keycloakProperties, times(1)).getRealm();
        verify(keycloakAdminClient, times(1)).realm(REALM);
        verify(realmResource, times(1)).users();
        verify(usersResource, times(1)).create(userRepresentation);
        verify(response, times(1)).getStatus();

        assertThat(actualUserId).isEqualTo(userId);
    }

    @Test
    void createUserFailed() {
        String userId = "userId";
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setId(userId);

        //mock
        mockRegisterUser_failed(userRepresentation);

        //invoke
        assertThrows(BusinessException.class, () -> authService.createUser(userRepresentation));

        //verify mocks
        verify(keycloakProperties, times(1)).getRealm();
        verify(keycloakAdminClient, times(1)).realm(REALM);
        verify(realmResource, times(1)).users();
        verify(usersResource, times(1)).create(userRepresentation);
        verify(response, times(1)).getStatus();
    }

    @Test
    void getByUsername() {
        final String id = "userId";
        final String userName = "userName";
        final String email = "email@email";
        final UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setId(id);
        userRepresentation.setUsername(userName);
        userRepresentation.setEmail(email);

        //mock
        mockFindByEmail(List.of(userRepresentation), email);

        //invoke
        Optional<UserRepresentation> result = authService.getByUsername(email);

        //assert
        assertTrue(result.isPresent());
        assertEquals(email, result.get().getEmail());

        //verify mocks
        findByEmailVerifications(email);
    }

    @Test
    void getByUsername_empty() {
        String email = "email@email";
        //mock
        mockFindByEmail(Collections.emptyList(), email);

        //invoke
        Optional<UserRepresentation> result = authService.getByUsername(email);

        //assert
        assertFalse(result.isPresent());

        //verify mocks
        findByEmailVerifications(email);
    }

  //TODO will be removed
//    @Test
//    void enablePendingUser_pending_user() {
//        String userId = "user";
//        String password = "password";
//
//        UserRepresentation userRepresentation = new UserRepresentation();
//        userRepresentation.setId(userId);
//        userRepresentation.singleAttribute(USER_STATUS.getName(), PENDING.name());
//
//        when(keycloakProperties.getRealm()).thenReturn(REALM);
//        when(keycloakAdminClient.realm(REALM)).thenReturn(realmResource);
//        when(realmResource.users()).thenReturn(usersResource);
//        when(usersResource.get(userId)).thenReturn(userResource);
//        when(userResource.toRepresentation()).thenReturn(userRepresentation);
//
//        authService.enablePendingUser(userId, password);
//
//        UserRepresentation result = authService.getUserRepresentationById(userId);
//        assertThat(result.getAttributes().get(USER_STATUS.getName()).get(0)).isEqualTo(REGISTERED.name());
//        assertThat(result.getCredentials().get(0).getValue()).isEqualTo(password);
//        assertTrue(result.isEnabled());
//    }

    //TODO remove
//    @Test
//    void enablePendingUser_not_pending_user() {
//        String userId = "user";
//        String password = "password";
//
//        UserRepresentation userRepresentation = new UserRepresentation();
//        userRepresentation.setId(userId);
//        userRepresentation.singleAttribute(USER_STATUS.getName(), REGISTERED.name());
//
//        when(keycloakProperties.getRealm()).thenReturn(REALM);
//        when(keycloakAdminClient.realm(REALM)).thenReturn(realmResource);
//        when(realmResource.users()).thenReturn(usersResource);
//        when(usersResource.get(userId)).thenReturn(userResource);
//        when(userResource.toRepresentation()).thenReturn(userRepresentation);
//
//        BusinessException businessException =
//            assertThrows(BusinessException.class, () -> authService.enablePendingUser(userId, password));
//
//        assertEquals(ErrorCode.USER_INVALID_STATUS, businessException.getErrorCode());
//    }

    @Test
    void createUserWithStatusPending() {
        final String userId = "userId";

        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setId(userId);

        //mock
        mockRegisterUser_created(userRepresentation, userId);

        //invoke
        authService.createUserWithStatusPending(userRepresentation);

        ArgumentCaptor<UserRepresentation> userCaptor = ArgumentCaptor.forClass(UserRepresentation.class);
        verify(usersResource, times(1)).create(userCaptor.capture());
        UserRepresentation registeredUser = userCaptor.getValue();

        assertThat(registeredUser.getId()).isEqualTo(userId);
        assertThat(registeredUser.getAttributes().get(USER_STATUS.getName()))
            .containsOnly(PENDING.name());
        assertFalse(registeredUser.isEnabled());

        verify(keycloakProperties, times(1)).getRealm();
        verify(keycloakAdminClient, times(1)).realm(REALM);
        verify(realmResource, times(1)).users();
        verify(response, times(1)).getStatus();
    }

    //TODO will be removed
//    @Test
//    void enableRegisteredUser() {
//        String userId = "user";
//        String password = "password";
//
//        UserRepresentation userRepresentation = new UserRepresentation();
//        userRepresentation.setId(userId);
//        userRepresentation.singleAttribute(USER_STATUS.getName(), REGISTERED.name());
//
//        when(keycloakProperties.getRealm()).thenReturn(REALM);
//        when(keycloakAdminClient.realm(REALM)).thenReturn(realmResource);
//        when(realmResource.users()).thenReturn(usersResource);
//        when(usersResource.get(userId)).thenReturn(userResource);
//        when(userResource.toRepresentation()).thenReturn(userRepresentation);
//
//        authService.enableRegisteredUser(userId, password);
//
//        UserRepresentation result = authService.getUserRepresentationById(userId);
//        assertThat(result.getAttributes().get(USER_STATUS.getName()).get(0)).isEqualTo(
//            AuthenticationStatus.REGISTERED.name());
//        assertThat(result.getCredentials().get(0).getValue()).isEqualTo(password);
//        assertTrue(result.isEnabled());
//    }

      //TODO will be removed
//    @Test
//    void enableRegisteredUser_user_not_registered() {
//        String userId = "user";
//        String password = "password";
//
//        UserRepresentation userRepresentation = new UserRepresentation();
//        userRepresentation.setId(userId);
//        userRepresentation.singleAttribute(USER_STATUS.getName(), PENDING.name());
//
//        when(keycloakProperties.getRealm()).thenReturn(REALM);
//        when(keycloakAdminClient.realm(REALM)).thenReturn(realmResource);
//        when(realmResource.users()).thenReturn(usersResource);
//        when(usersResource.get(userId)).thenReturn(userResource);
//        when(userResource.toRepresentation()).thenReturn(userRepresentation);
//
//        BusinessException businessException =
//            assertThrows(BusinessException.class, () -> authService.enableRegisteredUser(userId, password));
//
//        assertEquals(ErrorCode.USER_INVALID_STATUS, businessException.getErrorCode());
//    }

    @Test
    void validateAuthenticatedUserOtp() {
        String otp = "otp";
        String accessToken = "accessToken";

        authService.validateAuthenticatedUserOtp(otp, accessToken);

        verify(keycloakCustomClient, times(1)).validateAuthenticatedUserOtp(otp, accessToken);
    }
    
    @Test
    void validateUnAuthenticatedUserOtp() {
        String otp = "otp";
        String email = "email";

        authService.validateUnAuthenticatedUserOtp(otp, email);

        verify(keycloakCustomClient, times(1)).validateUnAuthenticatedUserOtp(otp, email);
    }

    @Test
    void deleteOtpCredentials() {
        final String userId = "userId";
        final String realm = "realm";
        final String credentialId = "id";
        CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
        credentialRepresentation.setType("otp");
        credentialRepresentation.setId(credentialId);

        // Mock
        when(keycloakProperties.getRealm()).thenReturn(realm);
        when(keycloakAdminClient.realm(realm)).thenReturn(realmResource);
        when(realmResource.users()).thenReturn(usersResource);
        when(usersResource.get(userId)).thenReturn(userResource);
        when(usersResource.get(userId).credentials()).thenReturn(List.of(credentialRepresentation));

        // Invoke
        authService.deleteOtpCredentials(userId);

        // Verify
        verify(usersResource.get(userId), times(1)).removeCredential(credentialId);
    }
    
  //TODO will be removed
//    @Test
//    void setPasswordForRegisteredUser() {
//    	String userId = "user";
//        String password = "password";
//        String otp = "otp";
//        String email = "email";
//
//        UserRepresentation userRepresentation = new UserRepresentation();
//        userRepresentation.setId(userId);
//        userRepresentation.singleAttribute(USER_STATUS.getName(), REGISTERED.name());
//
//        when(keycloakProperties.getRealm()).thenReturn(REALM);
//        when(keycloakAdminClient.realm(REALM)).thenReturn(realmResource);
//        when(realmResource.users()).thenReturn(usersResource);
//        when(usersResource.get(userId)).thenReturn(userResource);
//
//        authService.setPasswordForRegisteredUser(userRepresentation, password, otp, email);
//        
//        verify(userResource, times(1)).update(userRepresentation);
//    }
    
    //TODO will be removed
//    @Test
//    void setPasswordForRegisteredUser_user_not_registered() {
//    	String userId = "user";
//        String password = "password";
//        String otp = "otp";
//        String email = "email";
//
//        UserRepresentation userRepresentation = new UserRepresentation();
//        userRepresentation.setId(userId);
//        userRepresentation.singleAttribute(USER_STATUS.getName(), PENDING.name());
//
//        BusinessException businessException =
//            assertThrows(BusinessException.class, 
//            		() -> authService.setPasswordForRegisteredUser(userRepresentation, password, otp, email));
//
//        assertEquals(ErrorCode.USER_INVALID_STATUS, businessException.getErrorCode());
//    }
    
    @Test
    void deleteUserSessions() {
    	String userId = "user";

        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setId(userId);
        userRepresentation.singleAttribute(USER_STATUS.getName(), REGISTERED.name());
        UserSessionRepresentation session = new UserSessionRepresentation();
        session.setId(userId);

        when(keycloakProperties.getRealm()).thenReturn(REALM);
        when(keycloakAdminClient.realm(REALM)).thenReturn(realmResource);
        when(realmResource.users()).thenReturn(usersResource);
        when(usersResource.get(userId)).thenReturn(userResource);
        when(usersResource.get(userId).getUserSessions()).thenReturn(List.of(session, session, session));
        
        authService.deleteUserSessions(userId);
        
        verify(realmResource, times(3)).deleteSession(session.getId(), false);
    }

    private void mockRegisterUser_created(UserRepresentation userRepresentation, String userIdCreated) {
        when(keycloakProperties.getRealm()).thenReturn(REALM);
        when(keycloakAdminClient.realm(REALM)).thenReturn(realmResource);
        when(realmResource.users()).thenReturn(usersResource);
        when(usersResource.create(userRepresentation)).thenReturn(response);
        when(response.getStatus()).thenReturn(HttpStatus.CREATED.value());
        when(response.getStatusInfo()).thenReturn(Response.Status.CREATED);
        when(response.getLocation()).thenReturn(URI.create("http://www.esos.uk/" + userIdCreated));
    }
    
    private void mockGetUserResource(String userId, UserRepresentation userRepresentation) {
		when(keycloakProperties.getRealm()).thenReturn(REALM);
        when(keycloakAdminClient.realm(REALM)).thenReturn(realmResource);
        when(realmResource.users()).thenReturn(usersResource);
        when(usersResource.get(userId)).thenReturn(userResource);
        when(userResource.toRepresentation()).thenReturn(userRepresentation);
	}
    
    private void verifyGetUserResource(String userId) {
    	verifyGetUserResource(userId, 1);
	}
    
    private void verifyGetUserResource(String userId, int times) {
    	verify(keycloakProperties, atLeastOnce()).getRealm();
        verify(keycloakAdminClient, atLeastOnce()).realm(REALM);
        verify(realmResource, atLeastOnce()).users();
        verify(usersResource, times(times)).get(userId);
        verify(userResource, times(times)).toRepresentation();
	}

    private void mockRegisterUser_failed(UserRepresentation userRepresentation) {
        when(keycloakProperties.getRealm()).thenReturn(REALM);
        when(keycloakAdminClient.realm(REALM)).thenReturn(realmResource);
        when(realmResource.users()).thenReturn(usersResource);
        when(usersResource.create(userRepresentation)).thenReturn(response);
        when(response.getStatus()).thenReturn(HttpStatus.INTERNAL_SERVER_ERROR.value());
    }

    private void mockFindByEmail(List<UserRepresentation> userRepresentations, String email) {
        when(keycloakProperties.getRealm()).thenReturn(REALM);
        when(keycloakAdminClient.realm(REALM)).thenReturn(realmResource);
        when(realmResource.users()).thenReturn(usersResource);
        when(usersResource.search(email, true))
            .thenReturn(userRepresentations);
    }

    private void findByEmailVerifications(String email) {
        verify(keycloakProperties, times(1)).getRealm();
        verify(keycloakAdminClient, times(1)).realm(REALM);
        verify(realmResource, times(1)).users();
        verify(usersResource, times(1)).search(email, true);
    }
    
    private void verifyFindByEmail(String email) {
    	verify(keycloakProperties, atLeastOnce()).getRealm();
        verify(keycloakAdminClient, atLeastOnce()).realm(REALM);
        verify(realmResource, atLeastOnce()).users();
        verify(usersResource, times(1)).search(email, true);
    }

}
