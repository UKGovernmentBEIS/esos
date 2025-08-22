package uk.gov.esos.api.authorization.rules.domain;

/**
 * The authorization scope
 *
 */
public enum Scope {

    REQUEST_CREATE,
	REQUEST_TASK_EXECUTE,
	REQUEST_TASK_VIEW,
	REQUEST_TASK_ASSIGN,
	EDIT_USER,
	MANAGE_VB,
	MANAGE_VERIFIED_ORGANISATION_ACCOUNTS,
	EDIT_ACCOUNT_NOTE,
	EDIT_ACCOUNT_DETAILS,
}
