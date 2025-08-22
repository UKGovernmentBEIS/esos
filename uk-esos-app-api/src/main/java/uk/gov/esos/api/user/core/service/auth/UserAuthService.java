package uk.gov.esos.api.user.core.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.domain.model.UserDetails;
import uk.gov.esos.api.user.core.domain.model.UserInfo;
import uk.gov.esos.api.user.core.transform.UserMapper;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserAuthService {

    private final AuthService authService;
    private final UserMapper userMapper;

    public UserInfoDTO getUserByUserId(String userId) {
        return userMapper.toUserInfoDTO(authService.getUserRepresentationById(userId));
    }
    
	public Optional<UserInfoDTO> getUserByUserIdOpt(String userId) {
		return Optional.ofNullable(userMapper.toUserInfoDTO(authService.getUserRepresentationById(userId)));
	}

    public Optional<UserInfoDTO> getUserByEmail(String email) {
        return authService
                .getByUsername(email)
                .map(userMapper::toUserInfoDTO);
    }
    
    public List<UserInfo> getUsers(List<String> userIds) {
        return authService.getUsers(userIds);
    }
    
    public <T> List<T> getUsersWithAttributes(List<String> userIds, Class<T> attributesClazz) {
        return authService.getUsersWithAttributes(userIds, attributesClazz);
    }
    
    public Optional<UserDetails> getUserDetails(String userId) {
        return authService.getUserDetails(userId);
    }
    
    public Optional<FileDTO> getUserSignature(String signatureUuid) {
        return authService.getUserSignature(signatureUuid);
    }

    public void enablePendingUser(String userId, String password) {
        authService.enablePendingUser(userId, password);
    }
    
    public void updateUserTerms(String userId, Short newTermsVersion) {
        authService.updateUserTerms(userId, newTermsVersion);
    }

    public void validateAuthenticatedUserOtp(String otp, String token) {
        authService.validateAuthenticatedUserOtp(otp, token);
    }

    public void deleteOtpCredentialsByEmail(String email) {
        authService.getByUsername(email)
                .ifPresentOrElse(userRepresentation -> deleteOtpCredentials(userRepresentation.getId()),
                        () -> {throw new BusinessException(ErrorCode.USER_NOT_EXIST);});
    }

	public void deleteOtpCredentials(String userId) {
		authService.deleteOtpCredentials(userId);
		authService.deleteUserSessions(userId);
	}

	public void resetPassword(String email, String otp, String password) {
		authService.getByUsername(email)
		        .ifPresentOrElse(userRepresentation -> {
		            authService.setPasswordForRegisteredUser(userRepresentation, password, otp, email);
		            authService.deleteUserSessions(userRepresentation.getId());
		            },
                       () -> {throw new BusinessException(ErrorCode.USER_NOT_EXIST);});
		
	}
}
