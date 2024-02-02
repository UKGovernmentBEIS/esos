package uk.gov.esos.api.user.core.domain.enumeration;

/**
 * The status result of a user invitation action
 *
 */
public enum UserInvitationStatus {
	
	ACCEPTED,
	PENDING_USER_REGISTRATION,
    PENDING_USER_REGISTRATION_NO_PASSWORD,
    PENDING_USER_ENABLE
	
}
