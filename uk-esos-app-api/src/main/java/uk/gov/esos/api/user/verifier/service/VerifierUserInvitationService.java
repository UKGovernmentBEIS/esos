package uk.gov.esos.api.user.verifier.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.authorization.verifier.service.VerifierAuthorityService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.user.core.domain.dto.InvitedUserInfoDTO;
import uk.gov.esos.api.user.verifier.domain.AdminVerifierUserInvitationDTO;
import uk.gov.esos.api.user.verifier.domain.VerifierUserDTO;
import uk.gov.esos.api.user.verifier.domain.VerifierUserInvitationDTO;
import uk.gov.esos.api.user.verifier.transform.VerifierUserMapper;
import uk.gov.esos.api.verificationbody.service.VerificationBodyQueryService;

import static uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus.PENDING;

@Service
@Log4j2
@RequiredArgsConstructor
public class VerifierUserInvitationService {

    private final VerifierUserAuthService verifierUserAuthService;
    private final VerifierAuthorityService verifierAuthorityService;
    private final VerifierUserNotificationGateway verifierUserNotificationGateway;
    private final VerifierUserTokenVerificationService verifierUserTokenVerificationService;
    private final VerificationBodyQueryService verificationBodyQueryService;
    private final VerifierUserMapper verifierUserMapper = Mappers.getMapper(VerifierUserMapper.class);

    /**
     *  Invites a new verifier user to join verification body with a specified role.
     * @param pmrvUser the current logged-in {@link AppUser}
     * @param verifierUserInvitation the {@link VerifierUserInvitationDTO}
     */
    @Transactional
    public void inviteVerifierUser(AppUser pmrvUser, VerifierUserInvitationDTO verifierUserInvitation) {
        Long verificationBodyId = pmrvUser.getVerificationBodyId();
        inviteVerifierUser(pmrvUser, verifierUserInvitation, verificationBodyId);
    }

    /**
     * Invites a new verifier user to join verification body with VERIFIER ADMIN role.
     * @param pmrvUser the current logged-in {@link AppUser}
     * @param adminVerifierUserInvitationDTO the {@link AdminVerifierUserInvitationDTO}
     * @param verificationBodyId the id of the verification body to which the user will join
     */
    @Transactional
    public void inviteVerifierAdminUser(AppUser pmrvUser, AdminVerifierUserInvitationDTO adminVerifierUserInvitationDTO,
                                        Long verificationBodyId) {
        VerifierUserInvitationDTO verifierUserInvitationDTO =
            verifierUserMapper.toVerifierUserInvitationDTO(adminVerifierUserInvitationDTO);

        // Validate that non disabled verification body exists
        if(!verificationBodyQueryService.existsNonDisabledVerificationBodyById(verificationBodyId)){
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, verificationBodyId);
        }

        inviteVerifierUser(pmrvUser, verifierUserInvitationDTO, verificationBodyId);
    }

    public InvitedUserInfoDTO acceptInvitation(String invitationToken) {
        AuthorityInfoDTO authorityInfo = verifierUserTokenVerificationService.verifyInvitationTokenForPendingAuthority(invitationToken);

        VerifierUserDTO user = verifierUserAuthService.getVerifierUserById(authorityInfo.getUserId());

        if(user.getStatus() != PENDING) {
            log.error("User '{}' found with status '{}'", authorityInfo::getUserId, user::getStatus);
            throw new BusinessException(ErrorCode.USER_INVALID_STATUS);
        }

        return InvitedUserInfoDTO.builder().email(user.getEmail()).build();
    }

    private void inviteVerifierUser(AppUser pmrvUser, VerifierUserInvitationDTO verifierUserInvitation,
                                    Long verificationBodyId) {
        String userId = verifierUserAuthService.saveInvitedUser(verifierUserInvitation);

        String authorityUuid = verifierAuthorityService.createPendingAuthority(verificationBodyId,
            verifierUserInvitation.getRoleCode(), userId, pmrvUser);

        verifierUserNotificationGateway.notifyInvitedUser(verifierUserInvitation, authorityUuid);
    }
}
