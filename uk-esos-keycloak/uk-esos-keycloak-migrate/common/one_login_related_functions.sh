#!/bin/bash

generateCreateRootFlowPayload() {
  cat <<EOF
{
    "alias": "$ROOT_FLOW_ALIAS",
    "description": "Actions taken after first broker login with GOVUK One Login account, which is not yet linked to any ESOS account",
    "providerId": "basic-flow",
    "topLevel": true,
    "builtIn": false
}
EOF
}
export -f generateCreateRootFlowPayload

generateAddExecutionPayload() {
  cat <<EOF
{
    "provider": "$1",
    "priority": $2
}
EOF
}
export -f generateAddExecutionPayload

generateSetRequirementForExecutionPayload() {
  cat <<EOF
{
    "id": "$1",
    "priority": $2,
    "requirement": "$3"
}
EOF
}
export -f generateSetRequirementForExecutionPayload

generateAddSubflowPayload() {
  cat <<EOF
{
  "alias": "$1",
  "priority": $2,
  "type": "basic-flow"
}
EOF
}
export -f generateAddSubflowPayload

generateSetConfigurationForExecutionPayload() {
  cat <<EOF
{
    "alias": "$1",
    "config": {
        "$2": "$3"
    }
}
EOF
}
export -f generateSetConfigurationForExecutionPayload

generateBindFirstBrokerLoginFlowPayload() {
  cat <<EOF
{
  "firstBrokerLoginFlow": "$ROOT_FLOW_ALIAS"
}
EOF
}
export -f generateBindFirstBrokerLoginFlowPayload

generateSetEmailVerificationTimeLimitPayload() {
  days=${1:-4}
  cat <<EOF
{
  "attributes": {
    "actionTokenGeneratedByUserLifespan.verify-email": "$((60*60*24*days))"
  }
}
EOF
}
export -f generateSetEmailVerificationTimeLimitPayload

checkExitCode() {
  local exit_code=$1
  local script_name=$2

  if [[ $exit_code -ne 0 ]]; then
    echo -e "Error running $script_name"
    exit 1
  fi
}
export -f checkExitCode

createExecutionForFlow() {
  local flow_alias="$1"
  local provider=$2
  local priority=$3
  local payload=$(generateAddExecutionPayload $provider $priority)

  local keycloak_admin_access_token=$(getKeycloakAdminAccessToken)

  local create_execution_for_flow=$(curl -s -i -X POST "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME"/authentication/flows/"$flow_alias"/executions/execution \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $keycloak_admin_access_token" \
    --data-raw "$payload")

  if [ $? -ne 0 ]; then
    return 1
  fi

  local headers=$(sed -n '1,/^\r$/p' <<<"$create_execution_for_flow")
  local location=$(grep -oP 'Location: \K.*' <<<"$headers")
  local execution_id=$([[ $location =~ $UUID_REGEX ]] && echo "${BASH_REMATCH[0]}")
  local status_code=$(grep -oP 'HTTP/\d\.\d \K\d+' <<<"$headers")

  if [[ $status_code -ge 400 ]]; then
    return 1
  fi

  echo "$execution_id"
  return 0
}
export -f createExecutionForFlow

setRequirementForExecution() {
  local parent_flow_alias=$1
  local execution_id=$2
  local priority=$3
  local requirement=$4
  local payload=$(generateSetRequirementForExecutionPayload $execution_id $priority $requirement)

  local keycloak_admin_access_token=$(getKeycloakAdminAccessToken)

  local set_requirement_for_execution=$(curl -s -i -X PUT "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME"/authentication/flows/"$parent_flow_alias"/executions \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $keycloak_admin_access_token" \
    --data-raw "$payload")

  local exit_code=$?
  if [ $exit_code -ne 0 ]; then
    return 1
  fi

  local headers=$(sed -n '1,/^\r$/p' <<<"$set_requirement_for_execution")
  local status_code=$(grep -oP 'HTTP/\d\.\d \K\d+' <<<"$headers")

  if [[ $status_code -ge 400 ]]; then
    return 1
  fi

  return 0
}
export -f setRequirementForExecution

createSubflowForFlow() {
  local flow_alias="$1"
  local subflow_alias="$2"
  local priority=$3
  local payload=$(generateAddSubflowPayload $subflow_alias $priority)

  local keycloak_admin_access_token=$(getKeycloakAdminAccessToken)

  local create_subflow_for_flow=$(curl -s -i -X POST "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME"/authentication/flows/"$flow_alias"/executions/flow \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
    --data-raw "$payload")

  local exit_code=$?
  if [ $exit_code -ne 0 ]; then
    return 1
  fi

  local headers=$(sed -n '1,/^\r$/p' <<<"$create_subflow_for_flow")
  local location=$(grep -oP 'Location: \K.*' <<<"$headers")
  local subflow_id=$([[ $location =~ $UUID_REGEX ]] && echo "${BASH_REMATCH[0]}")
  local status_code=$(grep -oP 'HTTP/\d\.\d \K\d+' <<<"$headers")

  if [[ $status_code -ge 400 ]]; then
    return 1
  fi

  echo "$subflow_id"
  return 0
}
export -f createSubflowForFlow

getSubflowExecutionId() {
  local parent_flow_alias="$1"
  local subflow_id="$2"
  local keycloak_admin_access_token=$(getKeycloakAdminAccessToken)

  local get_subflow_executions=$(curl -s -L -X GET "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME"/authentication/flows/"$parent_flow_alias"/executions \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $keycloak_admin_access_token")

  if [[ $? -ne 0 ]]; then
      return 1
  fi

  local subflow_execution_id=$(echo "$get_subflow_executions" | jq -r ".[] | select(.flowId == \"$subflow_id\") | .id")

  echo "$subflow_execution_id"
  return 0
}
export -f getSubflowExecutionId

getSubflowIdAndExecutionIdByAlias() {
  local parent_flow_alias="$1"
  local subflow_alias="$2"
  local keycloak_admin_access_token=$(getKeycloakAdminAccessToken)

  local get_root_flow_executions=$(curl -s -L -X GET "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME"/authentication/flows/"$parent_flow_alias"/executions \
   -H 'Content-Type: application/json' \
   -H "Authorization: Bearer $keycloak_admin_access_token")

   if [[ $? -ne 0 ]]; then
     return 1
   fi

   local subflow_id=$(echo "$get_root_flow_executions" | jq -r ".[] | select(.displayName == \"$subflow_alias\") | .flowId")
   local subflow_execution_id=$(echo "$get_root_flow_executions" | jq -r ".[] | select(.displayName == \"$subflow_alias\") | .id")
   echo "$subflow_id $subflow_execution_id"
   return 0
}
export -f getSubflowIdAndExecutionIdByAlias

getIdentityProviderRedirectorExecutionId() {
  local parent_flow_alias="$1"
  local keycloak_admin_access_token=$(getKeycloakAdminAccessToken)

  local get_identity_provider_redirector_execution_id=$(curl -s -L -X GET "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME"/authentication/flows/"$parent_flow_alias"/executions \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $keycloak_admin_access_token")

  if [[ $? -ne 0 ]]; then
    return 1
  fi

  local execution_id=$(echo $get_identity_provider_redirector_execution_id | jq -r '.[] | select(.providerId == "identity-provider-redirector") | .id')
  echo "$execution_id"

  return 0
}
export -f getIdentityProviderRedirectorExecutionId

setConfigurationForExecution() {
  local execution_id="$1"
  local alias="$2"
  local config_name="$3"
  local config_value="$4"
  local payload=$(generateSetConfigurationForExecutionPayload $alias $config_name $config_value)

  local keycloak_admin_access_token=$(getKeycloakAdminAccessToken)

  local set_configuration_for_execution=$(curl -s -i -X POST "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME"/authentication/executions/"$execution_id"/config \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
    --data-raw "$payload")

  local headers=$(sed -n '1,/^\r$/p' <<<"$set_configuration_for_execution")
  local status_code=$(grep -oP 'HTTP/\d\.\d \K\d+' <<<"$headers")

  if [[ $status_code -ge 400 ]]; then
    return 1
  fi

  return 0
}
export -f setConfigurationForExecution

bindFirstBrokerLoginFlow() {
  local keycloak_admin_access_token=$(getKeycloakAdminAccessToken)

  local bind_first_broker_login_flow=$(curl -s -i -X PUT "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME" \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $keycloak_admin_access_token" \
    --data-raw "$(generateBindFirstBrokerLoginFlowPayload)")

  if [[ $? -ne 0 ]]; then
    return 1
  fi

  local headers=$(sed -n '1,/^\r$/p' <<<"$bind_first_broker_login_flow")
  local status_code=$(grep -oP 'HTTP/\d\.\d \K\d+' <<<"$headers")

  if [[ $status_code -ge 400 ]]; then
    return 1
  fi

  return 0
}
export -f bindFirstBrokerLoginFlow

getExecutionIdAndPriorityByDataKeyAndValue() {
  local parent_flow_alias="$1"
  local data_key="$2"
  local data_value="$3"
  local keycloak_admin_access_token=$(getKeycloakAdminAccessToken)
  local url="$UPDATE_REALM_URL$UK_ESOS_REALM_NAME/authentication/flows/$parent_flow_alias/executions"

  local get_executions_for_flow=$(curl -s -L -X GET "$url" \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $keycloak_admin_access_token")

  if [[ $? -ne 0 ]]; then
    return 1
  fi

  local execution_id=$(echo $get_executions_for_flow | jq --arg dataKey "$data_key" --arg dataValue "$data_value" -r '.[] | select(.[$dataKey] == $dataValue) | .id')
  local execution_priority=$(echo $get_executions_for_flow | jq --arg dataKey "$data_key" --arg dataValue "$data_value" -r '.[] | select(.[$dataKey] == $dataValue) | .priority')

  echo "$execution_id $execution_priority"

  return 0
}
export -f getExecutionIdAndPriorityByDataKeyAndValue
