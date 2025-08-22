package uk.gov.esos.api.workflow.request.core.domain.enumeration;

/**
 * Request Statuses
 */
public enum RequestStatus {
    IN_PROGRESS,
    COMPLETED,
    CANCELLED,
    WITHDRAWN,
    APPROVED,
    REJECTED,
    CLOSED,

    EXEMPT,

    TERMINATED
}
