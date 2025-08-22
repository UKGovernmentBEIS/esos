package uk.gov.esos.api.authorization.core.domain;

/**
 * Authority statuses enum.
 *
 */
public enum AuthorityStatus {
    PENDING,
    TEMP_DISABLED_PENDING, // not applicable
    ACTIVE,
    DISABLED,
    ACCEPTED,
    TEMP_DISABLED // not applicable
}
