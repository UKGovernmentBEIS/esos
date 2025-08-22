package uk.gov.esos.api.common.domain.converter;

import org.junit.jupiter.api.Test;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup;
import uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel;
import uk.gov.esos.api.authorization.regulator.transform.RegulatorPermissionsAdapter;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ACCOUNT_CLOSURE_SUBMIT;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ACCOUNT_USERS_EDIT;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ACTION_PLAN_APPLICATION_RE_INITIATE_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_CA_USERS_EDIT;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_NOTIFICATION_OF_COMPLIANCE_APPLICATION_RE_INITIATE_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_PROGRESS_UPDATE_1_APPLICATION_RE_INITIATE_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_PROGRESS_UPDATE_2_APPLICATION_RE_INITIATE_TASK;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_TASK_ASSIGNMENT;
import static uk.gov.esos.api.authorization.core.domain.Permission.PERM_UPLOAD_VERIFIED_ORGANISATION_ACCOUNTS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.ACCOUNT_CLOSURE;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.MANAGE_PARTICIPANT_USERS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.ASSIGN_REASSIGN_TASKS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.MANAGE_USERS_AND_CONTACTS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.RETURN_ACTION_PLAN;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.RETURN_NOC;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.RETURN_PROGRESS_UPDATE_2;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.RETURN_PROGRESS_UPDATE_1;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.REVIEW_ORGANISATION_ACCOUNT;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionGroup.MANAGE_VERIFIED_ORGANISATION_ACCOUNTS;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel.EXECUTE;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel.NONE;
import static uk.gov.esos.api.authorization.regulator.domain.RegulatorPermissionLevel.VIEW_ONLY;

class RegulatorPermissionsAdapterTest {

    @Test
    void getPermissionsFromPermissionGroupLevels_one_permission_per_group_level() {
        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> permissionGroupLevels =
            Map.of(REVIEW_ORGANISATION_ACCOUNT, VIEW_ONLY,
                MANAGE_USERS_AND_CONTACTS, NONE,
                ASSIGN_REASSIGN_TASKS, EXECUTE);

        List<Permission> expectedPermissions = List.of(
            PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK,
            PERM_TASK_ASSIGNMENT);

        assertThat(RegulatorPermissionsAdapter.getPermissionsFromPermissionGroupLevels(permissionGroupLevels))
            .containsExactlyInAnyOrderElementsOf(expectedPermissions);
    }

    @Test
    void getPermissionsFromPermissionGroupLevels_multiple_permissions_per_group_level() {
        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> permissionGroupLevels =
            Map.of(REVIEW_ORGANISATION_ACCOUNT, EXECUTE,
                MANAGE_USERS_AND_CONTACTS, NONE,
                ASSIGN_REASSIGN_TASKS, EXECUTE);

        List<Permission> expectedPermissions = List.of(
        		PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK,
        		PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK,
        		PERM_TASK_ASSIGNMENT);

        assertThat(RegulatorPermissionsAdapter.getPermissionsFromPermissionGroupLevels(permissionGroupLevels))
            .containsExactlyInAnyOrderElementsOf(expectedPermissions);
    }

    @Test
    void getPermissionsFromPermissionGroupLevels_multiple_permissions() {
        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> permissionGroupLevels = Map.ofEntries(
                Map.entry(REVIEW_ORGANISATION_ACCOUNT, EXECUTE),
                Map.entry(MANAGE_USERS_AND_CONTACTS, EXECUTE),
                Map.entry(ASSIGN_REASSIGN_TASKS, EXECUTE),
                Map.entry(MANAGE_VERIFIED_ORGANISATION_ACCOUNTS, EXECUTE));

        List<Permission> expectedPermissions = List.of(
                PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK,
                PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK,
                PERM_CA_USERS_EDIT,
                PERM_TASK_ASSIGNMENT,
                PERM_UPLOAD_VERIFIED_ORGANISATION_ACCOUNTS);

        assertThat(RegulatorPermissionsAdapter.getPermissionsFromPermissionGroupLevels(permissionGroupLevels))
            .containsExactlyInAnyOrderElementsOf(expectedPermissions);
    }

    @Test
    void getPermissionGroupLevelsFromPermissions_one_permission_per_group_level() {
        List<Permission> permissions = List.of(
        		PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK,
            PERM_TASK_ASSIGNMENT);

        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> expectedPermissionGroupLevels = new LinkedHashMap<>();
        expectedPermissionGroupLevels.put(REVIEW_ORGANISATION_ACCOUNT, VIEW_ONLY);
        expectedPermissionGroupLevels.put(RETURN_NOC, NONE);
        expectedPermissionGroupLevels.put(RETURN_ACTION_PLAN, NONE);
        expectedPermissionGroupLevels.put(RETURN_PROGRESS_UPDATE_1, NONE);
        expectedPermissionGroupLevels.put(MANAGE_USERS_AND_CONTACTS, NONE);
        expectedPermissionGroupLevels.put(MANAGE_PARTICIPANT_USERS, NONE);
        expectedPermissionGroupLevels.put(ASSIGN_REASSIGN_TASKS, EXECUTE);
        expectedPermissionGroupLevels.put(MANAGE_VERIFIED_ORGANISATION_ACCOUNTS, NONE);
        expectedPermissionGroupLevels.put(ACCOUNT_CLOSURE, NONE);
        expectedPermissionGroupLevels.put(RETURN_PROGRESS_UPDATE_2, NONE);

        assertThat(RegulatorPermissionsAdapter.getPermissionGroupLevelsFromPermissions(permissions))
            .containsExactlyInAnyOrderEntriesOf(expectedPermissionGroupLevels);
    }

    @Test
    void getPermissionGroupLevelsFromPermissions_multiple_permissions_per_group_level() {
        List<Permission> permissions = List.of(
            PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK,
            PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK,
            PERM_TASK_ASSIGNMENT);

        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> expectedPermissionGroupLevels = new LinkedHashMap<>();
        expectedPermissionGroupLevels.put(REVIEW_ORGANISATION_ACCOUNT, EXECUTE);
        expectedPermissionGroupLevels.put(RETURN_NOC, NONE);
        expectedPermissionGroupLevels.put(RETURN_ACTION_PLAN, NONE);
        expectedPermissionGroupLevels.put(RETURN_PROGRESS_UPDATE_1, NONE);
        expectedPermissionGroupLevels.put(MANAGE_USERS_AND_CONTACTS, NONE);
        expectedPermissionGroupLevels.put(MANAGE_PARTICIPANT_USERS, NONE);
        expectedPermissionGroupLevels.put(ASSIGN_REASSIGN_TASKS, EXECUTE);
        expectedPermissionGroupLevels.put(MANAGE_VERIFIED_ORGANISATION_ACCOUNTS, NONE);
        expectedPermissionGroupLevels.put(ACCOUNT_CLOSURE, NONE);
        expectedPermissionGroupLevels.put(RETURN_PROGRESS_UPDATE_2, NONE);

        assertThat(RegulatorPermissionsAdapter.getPermissionGroupLevelsFromPermissions(permissions))
            .containsExactlyInAnyOrderEntriesOf(expectedPermissionGroupLevels);
    }

    @Test
    void getPermissionGroupLevelsFromPermissions() {
        List<Permission> permissions = List.of(
                PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_VIEW_TASK,
                PERM_ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW_EXECUTE_TASK,
                PERM_NOTIFICATION_OF_COMPLIANCE_APPLICATION_RE_INITIATE_TASK,
                PERM_ACTION_PLAN_APPLICATION_RE_INITIATE_TASK,
                PERM_PROGRESS_UPDATE_1_APPLICATION_RE_INITIATE_TASK,
                PERM_CA_USERS_EDIT,
                PERM_ACCOUNT_USERS_EDIT,
                PERM_TASK_ASSIGNMENT,
                PERM_UPLOAD_VERIFIED_ORGANISATION_ACCOUNTS,
                PERM_ACCOUNT_CLOSURE_SUBMIT,
                PERM_PROGRESS_UPDATE_2_APPLICATION_RE_INITIATE_TASK);

        Map<RegulatorPermissionGroup, RegulatorPermissionLevel> expectedPermissionGroupLevels = new LinkedHashMap<>();
        expectedPermissionGroupLevels.put(REVIEW_ORGANISATION_ACCOUNT, EXECUTE);
        expectedPermissionGroupLevels.put(RETURN_NOC, EXECUTE);
        expectedPermissionGroupLevels.put(RETURN_ACTION_PLAN, EXECUTE);
        expectedPermissionGroupLevels.put(RETURN_PROGRESS_UPDATE_1, EXECUTE);
        expectedPermissionGroupLevels.put(MANAGE_USERS_AND_CONTACTS, EXECUTE);
        expectedPermissionGroupLevels.put(MANAGE_PARTICIPANT_USERS, EXECUTE);
        expectedPermissionGroupLevels.put(ASSIGN_REASSIGN_TASKS, EXECUTE);
        expectedPermissionGroupLevels.put(MANAGE_VERIFIED_ORGANISATION_ACCOUNTS, EXECUTE);
        expectedPermissionGroupLevels.put(ACCOUNT_CLOSURE, EXECUTE);
        expectedPermissionGroupLevels.put(RETURN_PROGRESS_UPDATE_2, EXECUTE);

        assertThat(RegulatorPermissionsAdapter.getPermissionGroupLevelsFromPermissions(permissions))
            .containsExactlyInAnyOrderEntriesOf(expectedPermissionGroupLevels);
    }

    @Test
    void getPermissionGroupLevels() {
        Map<RegulatorPermissionGroup, List<RegulatorPermissionLevel>> expectedPermissionGroupLevels = new LinkedHashMap<>();
        expectedPermissionGroupLevels.put(REVIEW_ORGANISATION_ACCOUNT, List.of(NONE, VIEW_ONLY, EXECUTE));
        expectedPermissionGroupLevels.put(RETURN_NOC, List.of(NONE, EXECUTE));
        expectedPermissionGroupLevels.put(RETURN_ACTION_PLAN, List.of(NONE, EXECUTE));
        expectedPermissionGroupLevels.put(RETURN_PROGRESS_UPDATE_1, List.of(NONE, EXECUTE));
        expectedPermissionGroupLevels.put(MANAGE_USERS_AND_CONTACTS, List.of(NONE, EXECUTE));
        expectedPermissionGroupLevels.put(MANAGE_PARTICIPANT_USERS, List.of(NONE, EXECUTE));
        expectedPermissionGroupLevels.put(ASSIGN_REASSIGN_TASKS, List.of(NONE, EXECUTE));
        expectedPermissionGroupLevels.put(MANAGE_VERIFIED_ORGANISATION_ACCOUNTS, List.of(NONE, EXECUTE));
        expectedPermissionGroupLevels.put(ACCOUNT_CLOSURE, List.of(NONE, EXECUTE));
        expectedPermissionGroupLevels.put(RETURN_PROGRESS_UPDATE_2, List.of(NONE, EXECUTE));

        Map<RegulatorPermissionGroup, List<RegulatorPermissionLevel>> actualPermissionGroupLevels =
            RegulatorPermissionsAdapter.getPermissionGroupLevels();

        assertThat(actualPermissionGroupLevels.keySet())
            .containsExactlyInAnyOrderElementsOf(expectedPermissionGroupLevels.keySet());
        actualPermissionGroupLevels.forEach((group, levels) ->
            assertThat(levels).containsExactlyElementsOf(expectedPermissionGroupLevels.get(group)));
    }
}
