package uk.gov.esos.api.user.core.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.authorization.core.service.AuthorityService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.token.JwtTokenService;
import uk.gov.esos.api.token.JwtTokenActionEnum;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserInvitationTokenVerificationServiceTest {

    @InjectMocks
    private UserInvitationTokenVerificationService userInvitationTokenVerificationService;

    @Mock
    private JwtTokenService jwtTokenService;

    @Mock
    private AuthorityService authorityService;

    @Test
    void verifyInvitationTokenForPendingAuthority() {
        String invitationToken = "invitationToken";
        JwtTokenActionEnum jwtTokenAction = JwtTokenActionEnum.OPERATOR_INVITATION;
        String authorityUuid = "authorityUuid";
        AuthorityInfoDTO authorityInfo = AuthorityInfoDTO.builder()
            .id(1L)
            .userId("user")
            .authorityStatus(AuthorityStatus.PENDING)
            .accountId(1L)
            .build();

        when(jwtTokenService.resolveTokenActionClaim(invitationToken, jwtTokenAction)).thenReturn(authorityUuid);
        when(authorityService.findAuthorityByUuidAndStatusPending(authorityUuid)).thenReturn(Optional.of(authorityInfo));

        AuthorityInfoDTO result = userInvitationTokenVerificationService.verifyInvitationTokenForPendingAuthority(invitationToken, jwtTokenAction);

        assertThat(result).isEqualTo(authorityInfo);

        verify(jwtTokenService, times(1)).resolveTokenActionClaim(invitationToken, jwtTokenAction);
        verify(authorityService, times(1)).findAuthorityByUuidAndStatusPending(authorityUuid);
    }

    @Test
    void verifyInvitationTokenForPendingAuthority_authority_not_found() {
        String invitationToken = "invitationToken";
        JwtTokenActionEnum jwtTokenAction = JwtTokenActionEnum.OPERATOR_INVITATION;
        String authorityUuid = "authorityUuid";


        when(jwtTokenService.resolveTokenActionClaim(invitationToken, jwtTokenAction)).thenReturn(authorityUuid);
        when(authorityService.findAuthorityByUuidAndStatusPending(authorityUuid)).thenReturn(Optional.empty());

        //invoke
        BusinessException ex = assertThrows(BusinessException.class, () ->
            userInvitationTokenVerificationService.verifyInvitationTokenForPendingAuthority(invitationToken, jwtTokenAction));

        assertThat(ex.getErrorCode()).isEqualTo(ErrorCode.INVALID_TOKEN);

        verify(jwtTokenService, times(1)).resolveTokenActionClaim(invitationToken, jwtTokenAction);
        verify(authorityService, times(1)).findAuthorityByUuidAndStatusPending(authorityUuid);
    }
}