package uk.gov.esos.api.user.regulator.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.regulator.service.RegulatorAuthorityService;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.user.core.service.UserSecuritySetupService;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserDTO;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserUpdateDTO;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegulatorUserManagementServiceTest {

	@InjectMocks
    private RegulatorUserManagementService service;

	@Mock
	private RegulatorAuthorityService regulatorAuthorityService;

	@Mock
	private RegulatorUserAuthService regulatorUserAuthService;
	
	@Mock
	private UserSecuritySetupService userSecuritySetupService;

	@Test
	void getRegulatorUserByUserId() {
		final String userId = "userId";
        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        AppAuthority pmrvAuthority = createRegulatorAuthority("code1", ca);
        AppUser authUser = buildRegulatorUser("reg1Id", "reg1", List.of(pmrvAuthority));

		when(regulatorAuthorityService.existsByUserIdAndCompetentAuthority(userId, ca)).thenReturn(true);
		when(regulatorUserAuthService.getRegulatorUserById(userId)).thenReturn(RegulatorUserDTO.builder().build());

		// Invoke
		service.getRegulatorUserByUserId(authUser, userId);

		// Assert
		verify(regulatorAuthorityService, times(1)).existsByUserIdAndCompetentAuthority(userId, ca);
		verify(regulatorUserAuthService, times(1)).getRegulatorUserById(userId);
	}

	@Test
	void getRegulatorUserByUserId_user_not_belongs_to_ca() {
		final String userId = "userId";
		final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        AppAuthority pmrvAuthority = createRegulatorAuthority("code1", ca);
        AppUser authUser = buildRegulatorUser("reg1Id", "reg1", List.of(pmrvAuthority));

		when(regulatorAuthorityService.existsByUserIdAndCompetentAuthority(userId, ca)).thenReturn(false);

		// Invoke
		BusinessException businessException = assertThrows(BusinessException.class,
				() -> service.getRegulatorUserByUserId(authUser, userId));

		// Assert
		assertEquals(ErrorCode.AUTHORITY_USER_NOT_RELATED_TO_CA, businessException.getErrorCode());
		verify(regulatorAuthorityService, times(1)).existsByUserIdAndCompetentAuthority(userId, ca);
		verify(regulatorUserAuthService, never()).getRegulatorUserById(anyString());
	}

	@Test
	void updateRegulatorUserByUserId() {
		final String userId = "userId";
        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        AppAuthority pmrvAuthority = createRegulatorAuthority("code1", ca);
        AppUser authUser = buildRegulatorUser("reg1Id", "reg1", List.of(pmrvAuthority));
		RegulatorUserDTO regulatorUserDTO = RegulatorUserDTO.builder().build();
		
		FileDTO signature = FileDTO.builder()
                .fileContent("content".getBytes())
                .fileName("signature")
                .fileSize(1L)
                .fileType("type")
                .build();

		when(regulatorAuthorityService.existsByUserIdAndCompetentAuthority(userId, ca)).thenReturn(true);

		// Invoke
		service.updateRegulatorUserByUserId(authUser, userId, regulatorUserDTO, signature);

		// Assert
		verify(regulatorAuthorityService, times(1)).existsByUserIdAndCompetentAuthority(userId, ca);
		verify(regulatorUserAuthService, times(1)).updateRegulatorUser(userId, regulatorUserDTO, signature);
	}

	@Test
	void updateRegulatorUserByUserId_user_not_belongs_to_ca() {
		final String userId = "userId";
        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        AppAuthority pmrvAuthority = createRegulatorAuthority("code1", ca);
        AppUser authUser = buildRegulatorUser("reg1Id", "reg1", List.of(pmrvAuthority));
        RegulatorUserDTO regulatorUserDTO = RegulatorUserDTO.builder().build();
        
        FileDTO signature = FileDTO.builder()
                .fileContent("content".getBytes())
                .fileName("signature")
                .fileSize(1L)
                .fileType("type")
                .build();

		when(regulatorAuthorityService.existsByUserIdAndCompetentAuthority(userId, ca)).thenReturn(false);

		// Invoke
		BusinessException businessException = assertThrows(BusinessException.class,
				() -> service.updateRegulatorUserByUserId(authUser, userId, regulatorUserDTO, signature));

		// Assert
		assertEquals(ErrorCode.AUTHORITY_USER_NOT_RELATED_TO_CA, businessException.getErrorCode());
		verify(regulatorAuthorityService, times(1)).existsByUserIdAndCompetentAuthority(userId, ca);
		verify(regulatorUserAuthService, never()).updateRegulatorUser(anyString(), any(), any());
	}

	@Test
	void updateCurrentRegulatorUser() {
		AppUser authUser = AppUser.builder().userId("authId").roleType(RoleType.REGULATOR)
				.authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build())).build();
		RegulatorUserUpdateDTO regulator = RegulatorUserUpdateDTO.builder()
				.user(RegulatorUserDTO.builder().build()).permissions(Map.of()).build();
		
		FileDTO signature = FileDTO.builder()
                .fileContent("content".getBytes())
                .fileName("signature")
                .fileSize(1L)
                .fileType("type")
                .build();

		// Invoke
		service.updateCurrentRegulatorUser(authUser, regulator, signature);

		// Assert
		verify(regulatorUserAuthService, times(1)).updateRegulatorUser(authUser.getUserId(), regulator.getUser(), signature);
	}
	
	@Test
	void resetRegulator2Fa() {
		final String userId = "userId";
        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        AppAuthority pmrvAuthority = createRegulatorAuthority("code1", ca);
        AppUser authUser = buildRegulatorUser("reg1Id", "reg1", List.of(pmrvAuthority));

		when(regulatorAuthorityService.existsByUserIdAndCompetentAuthority(userId, ca)).thenReturn(true);

		// Invoke
		service.resetRegulator2Fa(authUser, userId);

		// Assert
		verify(regulatorAuthorityService, times(1)).existsByUserIdAndCompetentAuthority(userId, ca);
		verify(userSecuritySetupService, times(1)).resetUser2Fa(userId);
	}

	@Test
	void resetRegulator2Fa_user_not_belongs_to_ca() {
		final String userId = "userId";
        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        AppAuthority pmrvAuthority = createRegulatorAuthority("code1", ca);
        AppUser authUser = buildRegulatorUser("reg1Id", "reg1", List.of(pmrvAuthority));

		when(regulatorAuthorityService.existsByUserIdAndCompetentAuthority(userId, ca)).thenReturn(false);

		// Invoke
		BusinessException businessException = assertThrows(BusinessException.class,
				() -> service.resetRegulator2Fa(authUser, userId));

		// Assert
		assertEquals(ErrorCode.AUTHORITY_USER_NOT_RELATED_TO_CA, businessException.getErrorCode());
		verify(regulatorAuthorityService, times(1)).existsByUserIdAndCompetentAuthority(userId, ca);
		verify(userSecuritySetupService, never()).resetUser2Fa(anyString());
	}
	
	private AppUser buildRegulatorUser(String userId, String username, List<AppAuthority> pmrvAuthorities) {

		return AppUser.builder()
				.userId(userId)
				.firstName(username)
				.lastName(username)
				.authorities(pmrvAuthorities)
				.roleType(RoleType.REGULATOR)
				.build();
	}

	private AppAuthority createRegulatorAuthority(String code, CompetentAuthorityEnum competentAuthority) {
		return AppAuthority.builder()
				.code(code)
				.competentAuthority(competentAuthority)
				.build();
	}
}
