package uk.gov.esos.api.user.operator.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.token.JwtTokenService;
import uk.gov.esos.api.token.JwtTokenActionEnum;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OperatorUserTokenVerificationServiceTest {
	
	@InjectMocks
	private OperatorUserTokenVerificationService service;
	
	@Mock
	private UserAuthService userAuthService;

	@Mock
	private JwtTokenService jwtTokenService;
	
	@Test
	void verifyRegistrationToken() {
		String token = "token";
		String userEmail = "email";
		
    	when(jwtTokenService.resolveTokenActionClaim(token, JwtTokenActionEnum.USER_REGISTRATION))
    		.thenReturn(userEmail);
    	when(userAuthService.getUserByEmail(userEmail)).thenReturn(Optional.empty());
    	
    	String result = service.verifyRegistrationToken(token);
    	
    	assertThat(result).isEqualTo(userEmail);
    	
    	verify(userAuthService, times(1)).getUserByEmail(userEmail);
	}
	
	@Test
	void verifyRegistrationToken_user_exists() {
		String token = "token";
		String userEmail = "email";
		
		UserInfoDTO user = 
				UserInfoDTO.builder()
    				.build();
		
    	when(jwtTokenService.resolveTokenActionClaim(token, JwtTokenActionEnum.USER_REGISTRATION))
    		.thenReturn(userEmail);
    	when(userAuthService.getUserByEmail(userEmail)).thenReturn(Optional.of(user));
    	
    	//invoke
    	BusinessException ex = assertThrows(BusinessException.class, () -> {
    		service.verifyRegistrationToken(token);
    	});
    	assertThat(ex.getErrorCode()).isEqualTo(ErrorCode.USER_ALREADY_REGISTERED);

    	verify(userAuthService, times(1)).getUserByEmail(userEmail);
	}
}
