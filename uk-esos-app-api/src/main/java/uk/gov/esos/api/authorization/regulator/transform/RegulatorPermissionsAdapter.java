package uk.gov.esos.api.authorization.regulator.transform;

import lombok.experimental.UtilityClass;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup;
import uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroupLevel;
import uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ACCOUNT_CLOSURE_SUBMIT;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ACCOUNT_USERS_EDIT;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ACTION_PLAN_APPLICATION_RE_INITIATE_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_CA_USERS_EDIT;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_NOTIFICATION_OF_COMPLIANCE_APPLICATION_RE_INITIATE_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_PROGRESS_UPDATE_2_APPLICATION_RE_INITIATE_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_PROGRESS_UPDATE_1_APPLICATION_RE_INITIATE_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_TASK_ASSIGNMENT;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_UPLOAD_VERIFIED_ORGANISATION_ACCOUNTS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.ACCOUNT_CLOSURE;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.MANAGE_PARTICIPANT_USERS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.ASSIGN_REASSIGN_TASKS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.MANAGE_USERS_AND_CONTACTS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.RETURN_ACTION_PLAN;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.RETURN_NOC;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.RETURN_PROGRESS_UPDATE_1;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.RETURN_PROGRESS_UPDATE_2;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.REVIEW_ORGANISATION_ACCOUNT;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.MANAGE_VERIFIED_ORGANISATION_ACCOUNTS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel.EXECUTE;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel.NONE;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel.VIEW_ONLY;

@UtilityClass
public class RegulatorPermissionsAdapter {

    private final Map<RegulatorPermissionGroupLevel, List<Permission>> permissionGroupLevelsConfig;

    static {
        permissionGroupLevelsConfig = new LinkedHashMap<>();

        //REVIEW_ORGANIZATION_ACCOUNT
        permissionGroupLevelsConfig
            .put(new RegulatorPermissionGroupLevel(REVIEW_ORGANISATION_ACCOUNT, NONE), List.of());
        permissionGroupLevelsConfig
            .put(new RegulatorPermissionGroupLevel(REVIEW_ORGANISATION_ACCOUNT, VIEW_ONLY),
                List.of(PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK));
        permissionGroupLevelsConfig
            .put(new RegulatorPermissionGroupLevel(REVIEW_ORGANISATION_ACCOUNT, EXECUTE),
                List.of(PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK,
                		PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK));

        // RETURN NOC
        permissionGroupLevelsConfig
                .put(new RegulatorPermissionGroupLevel(RETURN_NOC, NONE), List.of());
        permissionGroupLevelsConfig
                .put(new RegulatorPermissionGroupLevel(RETURN_NOC, EXECUTE),
                        List.of(PERM_NOTIFICATION_OF_COMPLIANCE_APPLICATION_RE_INITIATE_TASK));

        //MANAGE_USERS_AND_CONTACTS
        permissionGroupLevelsConfig
            .put(new RegulatorPermissionGroupLevel(MANAGE_USERS_AND_CONTACTS, NONE),
                Collections.emptyList());
        permissionGroupLevelsConfig
            .put(new RegulatorPermissionGroupLevel(MANAGE_USERS_AND_CONTACTS, EXECUTE),
                List.of(PERM_CA_USERS_EDIT));

        //MANAGE_PARTICIPANT_USERS
        permissionGroupLevelsConfig
                .put(new RegulatorPermissionGroupLevel(MANAGE_PARTICIPANT_USERS, NONE), List.of());
        permissionGroupLevelsConfig
                .put(new RegulatorPermissionGroupLevel(MANAGE_PARTICIPANT_USERS, EXECUTE),
                        List.of(PERM_ACCOUNT_USERS_EDIT));

        //ASSIGN_REASSIGN TASKS
        permissionGroupLevelsConfig
            .put(new RegulatorPermissionGroupLevel(ASSIGN_REASSIGN_TASKS, NONE), List.of());
        permissionGroupLevelsConfig
            .put(new RegulatorPermissionGroupLevel(ASSIGN_REASSIGN_TASKS, EXECUTE),
                List.of(PERM_TASK_ASSIGNMENT));
        
        //UPLOAD VERIFIED ORGANISATION ACCOUNTS
        permissionGroupLevelsConfig
            .put(new RegulatorPermissionGroupLevel(MANAGE_VERIFIED_ORGANISATION_ACCOUNTS, NONE), List.of());
        permissionGroupLevelsConfig
            .put(new RegulatorPermissionGroupLevel(MANAGE_VERIFIED_ORGANISATION_ACCOUNTS, EXECUTE),
                List.of(PERM_UPLOAD_VERIFIED_ORGANISATION_ACCOUNTS));

        //ACCOUNT CLOSURE
        permissionGroupLevelsConfig
                .put(new RegulatorPermissionGroupLevel(ACCOUNT_CLOSURE, NONE), List.of());
        permissionGroupLevelsConfig
                .put(new RegulatorPermissionGroupLevel(ACCOUNT_CLOSURE, EXECUTE),
                        List.of(PERM_ACCOUNT_CLOSURE_SUBMIT));

        // RETURN ACTION PLAN
        permissionGroupLevelsConfig
                .put(new RegulatorPermissionGroupLevel(RETURN_ACTION_PLAN, NONE), List.of());
        permissionGroupLevelsConfig
                .put(new RegulatorPermissionGroupLevel(RETURN_ACTION_PLAN, EXECUTE),
                        List.of(PERM_ACTION_PLAN_APPLICATION_RE_INITIATE_TASK));

        permissionGroupLevelsConfig
                .put(new RegulatorPermissionGroupLevel(RETURN_PROGRESS_UPDATE_2, NONE), List.of());
        permissionGroupLevelsConfig
                .put(new RegulatorPermissionGroupLevel(RETURN_PROGRESS_UPDATE_2, EXECUTE),
                        List.of(PERM_PROGRESS_UPDATE_2_APPLICATION_RE_INITIATE_TASK));

        // RETURN PROGRESS UPDATE 1
        permissionGroupLevelsConfig
                .put(new RegulatorPermissionGroupLevel(RETURN_PROGRESS_UPDATE_1, NONE), List.of());
        permissionGroupLevelsConfig
                .put(new RegulatorPermissionGroupLevel(RETURN_PROGRESS_UPDATE_1, EXECUTE),
                        List.of(PERM_PROGRESS_UPDATE_1_APPLICATION_RE_INITIATE_TASK));
    }

    public List<Permission> getPermissionsFromPermissionGroupLevels(
        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> permissionGroupLevels) {
        List<Permission> permissions = new ArrayList<>();

        permissionGroupLevels.forEach((group, level) ->
            Optional.ofNullable(permissionGroupLevelsConfig.get(new RegulatorPermissionGroupLevel(group, level)))
                .ifPresent(permissions::addAll));

        return permissions;
    }

    public Map<RegulatorPermissionGroup, RegulatorPermissionLevel> getPermissionGroupLevelsFromPermissions(
        List<Permission> permissions) {

        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> permissionGroupLevels = new LinkedHashMap<>();
        permissionGroupLevelsConfig.forEach((configGroupLevel, configPermissionList) -> {
            if (permissions.containsAll(configPermissionList) &&
                isExistingLevelLessThanConfigLevel(permissionGroupLevels.get(configGroupLevel.getGroup()),
                    configGroupLevel)) {
                permissionGroupLevels.put(configGroupLevel.getGroup(), configGroupLevel.getLevel());
            }
        });

        return permissionGroupLevels;
    }

    public Map<RegulatorPermissionGroup, List<RegulatorPermissionLevel>> getPermissionGroupLevels() {
        return
            permissionGroupLevelsConfig.keySet().stream()
                .collect(Collectors.groupingBy(
                    RegulatorPermissionGroupLevel::getGroup,
                    LinkedHashMap::new,
                    Collectors.mapping(RegulatorPermissionGroupLevel::getLevel, toList())));
    }

    private boolean isExistingLevelLessThanConfigLevel(
        RegulatorPermissionLevel existingLevel, RegulatorPermissionGroupLevel configGroupLevel) {
        if (existingLevel == null) {
            return true;
        }
        return existingLevel.isLessThan(configGroupLevel.getLevel());
    }

}
