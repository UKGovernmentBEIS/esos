#!/bin/bash

SCRIPT_NAME=$(basename -- "$0")

set -e

UPDATE_REALM_URL="$BASE_URL/admin/realms/"

################################################################################################################################################################################

KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)
CREATE_ROOT_FLOW=$(curl -s -i -X POST "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME"/authentication/flows \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
  --data-raw "$(generateCreateRootFlowPayload)")

checkExitCode $? $SCRIPT_NAME
echo "Root flow created successfully"

################################################################################################################################################################################

HANDLE_EXISTING_OR_NEW_EXECUTION_ID=$(createExecutionForFlow "$ROOT_FLOW_ALIAS" "$HANDLE_EXISTING_OR_NEW_PROVIDER_ALIAS" 0)
checkExitCode $? $SCRIPT_NAME
SET_HANDLE_EXISTING_OR_NEW_EXECUTION_TO_REQUIRED=$(setRequirementForExecution $ROOT_FLOW_ALIAS $HANDLE_EXISTING_OR_NEW_EXECUTION_ID 0 "REQUIRED")
checkExitCode $? $SCRIPT_NAME
echo "Handle existing or new user execution created successfully"

################################################################################################################################################################################

declare -A subflow_data
subflow_data=(
  ["$CONDITIONAL_SUBFLOW_EXISTING_USER_ALIAS"]=0
  ["$CONDITIONAL_SUBFLOW_NEW_USER_ALIAS"]=1
)

for alias in ${!subflow_data[@]}; do
  subflow_id=$(createSubflowForFlow "$ROOT_FLOW_ALIAS" "$alias" ${subflow_data[$alias]})
  checkExitCode $? $SCRIPT_NAME
  subflow_execution_id=$(getSubflowExecutionId "$ROOT_FLOW_ALIAS" "$subflow_id")
  checkExitCode $? $SCRIPT_NAME
  set_execution_to_conditional=$(setRequirementForExecution $ROOT_FLOW_ALIAS $subflow_execution_id ${subflow_data[$alias]} "CONDITIONAL")
  checkExitCode $? $SCRIPT_NAME
done
echo "Subflows for existing and new user created successfully"

################################################################################################################################################################################

USER_CLAIMS_EXISTS_CONDITION_EXECUTION_ID=$(createExecutionForFlow "$CONDITIONAL_SUBFLOW_EXISTING_USER_ALIAS" $EXISTING_USER_CONDITIONAL_PROVIDER 0)
checkExitCode $? $SCRIPT_NAME
SET_USER_CLAIMS_EXISTS_CONDITION_TO_REQUIRED=$(setRequirementForExecution $CONDITIONAL_SUBFLOW_EXISTING_USER_ALIAS $USER_CLAIMS_EXISTS_CONDITION_EXECUTION_ID 0 "REQUIRED")
checkExitCode $? $SCRIPT_NAME
SET_CONFIG_FOR_USER_CLAIMS_EXISTS=$(setConfigurationForExecution $USER_CLAIMS_EXISTS_CONDITION_EXECUTION_ID $EXISTING_USER_CONDITIONAL_ALIAS_EXISTING "userExists" "true")
checkExitCode $? $SCRIPT_NAME
echo "User claims exists condition execution created successfully"

################################################################################################################################################################################

subflow_data=(
  ["$CONDITIONAL_SUBFLOW_EXISTING_USER_WITHOUT_LOGIN_HINT"]=1
  ["$CONDITIONAL_SUBFLOW_EXISTING_USER_WITH_LOGIN_HINT"]=2
)

for alias in ${!subflow_data[@]}; do
  subflow_id=$(createSubflowForFlow "$CONDITIONAL_SUBFLOW_EXISTING_USER_ALIAS" "$alias" ${subflow_data[$alias]})
  checkExitCode $? $SCRIPT_NAME
  subflow_execution_id=$(getSubflowExecutionId "$CONDITIONAL_SUBFLOW_EXISTING_USER_ALIAS" "$subflow_id")
  checkExitCode $? $SCRIPT_NAME
  set_execution_to_conditional=$(setRequirementForExecution $CONDITIONAL_SUBFLOW_EXISTING_USER_ALIAS $subflow_execution_id ${subflow_data[$alias]} "CONDITIONAL")
  checkExitCode $? $SCRIPT_NAME
done
echo "Subflows for existing user with and without login hint created successfully"

################################################################################################################################################################################

CONDITIONAL_SUBFLOW_EXISTING_USER_OTP_FORM_EXECUTION_ID=$(createExecutionForFlow "$CONDITIONAL_SUBFLOW_EXISTING_USER_ALIAS" $OTP_FORM_PROVIDER 3)
checkExitCode $? $SCRIPT_NAME
SET_OTP_FORM_TO_REQUIRED=$(setRequirementForExecution $CONDITIONAL_SUBFLOW_EXISTING_USER_ALIAS $CONDITIONAL_SUBFLOW_EXISTING_USER_OTP_FORM_EXECUTION_ID 3 "REQUIRED")
checkExitCode $? $SCRIPT_NAME
echo "OTP form execution created successfully"

################################################################################################################################################################################

NO_LOGIN_HINT_CONDITION_EXECUTION_ID=$(createExecutionForFlow "$CONDITIONAL_SUBFLOW_EXISTING_USER_WITHOUT_LOGIN_HINT" $EXISTING_USER_LOGIN_HINT_CONDITIONAL_PROVIDER 0)
checkExitCode $? $SCRIPT_NAME
SET_NO_LOGIN_HINT_CONDITION_TO_REQUIRED=$(setRequirementForExecution $CONDITIONAL_SUBFLOW_EXISTING_USER_WITHOUT_LOGIN_HINT $NO_LOGIN_HINT_CONDITION_EXECUTION_ID 0 "REQUIRED")
checkExitCode $? $SCRIPT_NAME
SET_CONFIG_FOR_NO_LOGIN_HINT_CONDITION=$(setConfigurationForExecution $NO_LOGIN_HINT_CONDITION_EXECUTION_ID $EXISTING_USER_LOGIN_HINT_CONDITIONAL_ALIAS_NO_LOGIN_HINT "needsLoginHint" "false")
checkExitCode $? $SCRIPT_NAME
echo "No login hint condition execution created successfully"

################################################################################################################################################################################

USERNAME_PASSWORD_FORM_EXECUTION_ID=$(createExecutionForFlow "$CONDITIONAL_SUBFLOW_EXISTING_USER_WITHOUT_LOGIN_HINT" $USERNAME_PASSWORD_FORM_PROVIDER 1)
checkExitCode $? $SCRIPT_NAME
SET_USERNAME_PASSWORD_FORM_TO_REQUIRED=$(setRequirementForExecution "$CONDITIONAL_SUBFLOW_EXISTING_USER_WITHOUT_LOGIN_HINT" $USERNAME_PASSWORD_FORM_EXECUTION_ID 1 "REQUIRED")
checkExitCode $? $SCRIPT_NAME
echo "Username password form execution created successfully"

################################################################################################################################################################################

WITH_LOGIN_HINT_CONDITION_EXECUTION_ID=$(createExecutionForFlow "$CONDITIONAL_SUBFLOW_EXISTING_USER_WITH_LOGIN_HINT" $EXISTING_USER_LOGIN_HINT_CONDITIONAL_PROVIDER 1)
checkExitCode $? $SCRIPT_NAME
SET_WITH_LOGIN_HINT_CONDITION_TO_REQUIRED=$(setRequirementForExecution "$CONDITIONAL_SUBFLOW_EXISTING_USER_WITH_LOGIN_HINT" $WITH_LOGIN_HINT_CONDITION_EXECUTION_ID 1 "REQUIRED")
checkExitCode $? $SCRIPT_NAME
SET_CONFIG_FOR_WITH_LOGIN_HINT_CONDITION=$(setConfigurationForExecution $WITH_LOGIN_HINT_CONDITION_EXECUTION_ID $EXISTING_USER_LOGIN_HINT_CONDITIONAL_ALIAS_WITH_LOGIN_HINT "needsLoginHint" "true")
checkExitCode $? $SCRIPT_NAME
echo "With login hint condition execution created successfully"

################################################################################################################################################################################

PASSWORD_FORM_EXECUTION_ID=$(createExecutionForFlow "$CONDITIONAL_SUBFLOW_EXISTING_USER_WITH_LOGIN_HINT" $PASSWORD_FORM_PROVIDER 2)
checkExitCode $? $SCRIPT_NAME
SET_PASSWORD_FORM_TO_REQUIRED=$(setRequirementForExecution "$CONDITIONAL_SUBFLOW_EXISTING_USER_WITH_LOGIN_HINT" $PASSWORD_FORM_EXECUTION_ID 2 "REQUIRED")
checkExitCode $? $SCRIPT_NAME
echo "Password form execution created successfully"

################################################################################################################################################################################

USER_CLAIMS_NOT_EXISTS_CONDITION_EXECUTION_ID=$(createExecutionForFlow "$CONDITIONAL_SUBFLOW_NEW_USER_ALIAS" $EXISTING_USER_CONDITIONAL_PROVIDER 0)
checkExitCode $? $SCRIPT_NAME
SET_USER_CLAIMS_NOT_EXISTS_CONDITION_TO_REQUIRED=$(setRequirementForExecution "$CONDITIONAL_SUBFLOW_NEW_USER_ALIAS" $USER_CLAIMS_NOT_EXISTS_CONDITION_EXECUTION_ID 0 "REQUIRED")
checkExitCode $? $SCRIPT_NAME
SET_CONFIG_FOR_USER_CLAIMS_NOT_EXISTS=$(setConfigurationForExecution $USER_CLAIMS_NOT_EXISTS_CONDITION_EXECUTION_ID $EXISTING_USER_CONDITIONAL_ALIAS_NEW "userExists" "false")
checkExitCode $? $SCRIPT_NAME
echo "User claims not exists condition execution created successfully"

################################################################################################################################################################################

NEW_USER_INFO_EXECUTION_ID=$(createExecutionForFlow "$CONDITIONAL_SUBFLOW_NEW_USER_ALIAS" $NEW_USER_INFO_PROVIDER 1)
checkExitCode $? $SCRIPT_NAME
SET_NEW_USER_INFO_TO_REQUIRED=$(setRequirementForExecution "$CONDITIONAL_SUBFLOW_NEW_USER_ALIAS" $NEW_USER_INFO_EXECUTION_ID 1 "REQUIRED")
checkExitCode $? $SCRIPT_NAME
echo "New user info execution created successfully"

################################################################################################################################################################################

VERIFY_NEW_USER_EMAIL_EXECUTION_ID=$(createExecutionForFlow "$CONDITIONAL_SUBFLOW_NEW_USER_ALIAS" $VERIFY_NEW_USER_EMAIL_PROVIDER 2)
checkExitCode $? $SCRIPT_NAME
SET_VERIFY_NEW_USER_EMAIL_TO_REQUIRED=$(setRequirementForExecution "$CONDITIONAL_SUBFLOW_NEW_USER_ALIAS" $VERIFY_NEW_USER_EMAIL_EXECUTION_ID 2 "REQUIRED")
checkExitCode $? $SCRIPT_NAME
echo "Verify new user email execution created successfully"

################################################################################################################################################################################

EMAIL_CONFIRMATION_SUCCESS_EXECUTION_ID=$(createExecutionForFlow "$CONDITIONAL_SUBFLOW_NEW_USER_ALIAS" $EMAIL_CONFIRMATION_SUCCESS_PROVIDER 3)
checkExitCode $? $SCRIPT_NAME
SET_EMAIL_CONFIRMATION_SUCCESS_TO_REQUIRED=$(setRequirementForExecution "$CONDITIONAL_SUBFLOW_NEW_USER_ALIAS" $EMAIL_CONFIRMATION_SUCCESS_EXECUTION_ID 3 "REQUIRED")
checkExitCode $? $SCRIPT_NAME
echo "Email confirmation success execution created successfully"

################################################################################################################################################################################

BIND_FIRST_BROKER_LOGIN_FLOW=$(bindFirstBrokerLoginFlow)
checkExitCode $? $SCRIPT_NAME
echo "First broker login flow bound successfully to the realm"

################################################################################################################################################################################

echo "Basic first broker login flow created successfully"

#Add script name as user to changelog realm for tracking purposes
ADD_SCRIPT_TO_CHANGELOG=$(addUserToChangeLogRealm "$SCRIPT_NAME")

if [ -z "$ADD_SCRIPT_TO_CHANGELOG" ]
then
	echo " Script $SCRIPT_NAME added to changelog"
else
	echo " Script $SCRIPT_NAME was not to added to changelog. Reason: $ADD_SCRIPT_TO_CHANGELOG"
fi
