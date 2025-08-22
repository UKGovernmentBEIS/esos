package uk.gov.esos.api.workflow.request.core.domain.enumeration;

import jakarta.validation.constraints.NotNull;

import lombok.Getter;

import uk.gov.esos.api.common.domain.enumeration.AccountType;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Request Types.
 */
@Getter
public enum RequestType {

    ORGANISATION_ACCOUNT_OPENING("PROCESS_ORGANISATION_ACCOUNT_OPENING", "Organisation Account creation", RequestHistoryCategory.PERMIT, AccountType.ORGANISATION, false, true),

    NOTIFICATION_OF_COMPLIANCE_P3("PROCESS_NOTIFICATION_OF_COMPLIANCE_P3", "P3 Notification of compliance", RequestHistoryCategory.REPORTING, AccountType.ORGANISATION, true, true),

    ACTION_PLAN_P3("PROCESS_ACTION_PLAN_P3", "P3 Action plan", RequestHistoryCategory.REPORTING, AccountType.ORGANISATION, true, true),

    ACCOUNT_CLOSURE("PROCESS_ACCOUNT_CLOSURE", "Account closure", RequestHistoryCategory.PERMIT, AccountType.ORGANISATION, true, true),

    PROGRESS_UPDATE_1_P3("PROCESS_PROGRESS_UPDATE_1_P3", "P3 Progress update 1", RequestHistoryCategory.REPORTING, AccountType.ORGANISATION, true, true),

    PROGRESS_UPDATE_2_P3("PROCESS_PROGRESS_UPDATE_2_P3", "P3 Progress update 2", RequestHistoryCategory.REPORTING, AccountType.ORGANISATION, true, true);

    /**
     * The id of the bpmn process that will be instantiated for this request type.
     */
    private final String processDefinitionId;

    /**
     * The description of the request type.
     */
    private final String description;

    private final RequestHistoryCategory category;

    private final AccountType accountType;

    private final boolean holdHistory;
    
    /**
     * Whether request is displayed when in progress status
     */
    private final boolean displayedInProgress;

    RequestType(String processDefinitionId, String description, RequestHistoryCategory category, AccountType accountType, boolean holdHistory, boolean displayedInProgress) {
        this.processDefinitionId = processDefinitionId;
        this.description = description;
        this.category = category;
        this.accountType = accountType;
        this.holdHistory = holdHistory;
        this.displayedInProgress = displayedInProgress;
    }

    public static Set<RequestType> getCascadableRequestTypes() {
        return Set.of();
    }
    
    public static Set<RequestType> getNotDisplayedInProgressRequestTypes() {
    	return Stream.of(RequestType.values())
                .filter(type -> !type.isDisplayedInProgress())
                .collect(Collectors.toSet());
    }
    
    public static Set<RequestType> getRequestTypesByCategory(RequestHistoryCategory category) {
        return Stream.of(RequestType.values())
            .filter(type -> type.getCategory() == category)
            .collect(Collectors.toSet());
    }

    public static Set<RequestType> getAvailableForAccountCreateRequestTypes(@NotNull AccountType accountType) {
        Set<RequestType> requestTypes = getAvailableForReportingCreateRequestTypes(accountType);
        requestTypes.add(ACCOUNT_CLOSURE);
        return requestTypes;
    }

    public static Set<RequestType> getAvailableForReportingCreateRequestTypes(@NotNull AccountType accountType) {
        Set<RequestType> requestTypes = Set.of(NOTIFICATION_OF_COMPLIANCE_P3, ACTION_PLAN_P3,PROGRESS_UPDATE_1_P3,PROGRESS_UPDATE_2_P3);


        return requestTypes.stream()
                .filter(requestType -> accountType.equals(requestType.getAccountType()))
                .collect(Collectors.toSet());
    }
    
}
