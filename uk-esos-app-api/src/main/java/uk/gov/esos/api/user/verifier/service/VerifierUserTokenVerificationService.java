package uk.gov.esos.api.user.verifier.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.token.JwtTokenActionEnum;
import uk.gov.esos.api.user.core.service.UserInvitationTokenService;

@Service
@RequiredArgsConstructor
public class VerifierUserTokenVerificationService {

    private final UserInvitationTokenService userInvitationTokenVerificationService;

    public AuthorityInfoDTO verifyInvitationTokenForPendingAuthority(String invitationToken) {
        return userInvitationTokenVerificationService
            .verifyInvitationTokenForPendingAuthority(invitationToken, JwtTokenActionEnum.VERIFIER_INVITATION);
    }
}
