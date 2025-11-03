#!/bin/bash

#This script enables OTP for master realm browser authentication flow.

SCRIPT_NAME=$(basename -- "$0")

set -e

#Variables Declaration
UPDATE_REALM_URL="$BASE_URL/admin/realms/"

#Get Keycloak Admin Access Token using method from imported functions script
KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)

#Get list of browser executions
GET_BROWSER_EXECUTIONS=$(curl -s -L -X GET "$UPDATE_REALM_URL"/master/authentication/flows/browser/executions \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN")

#Find browser flow and mark it as required/disabled according to env var
declare REQUIREMENT
if [[ -n "$MASTER_REALM_BROWSER_REQUIRE_OTP" ]] && [[ "$MASTER_REALM_BROWSER_REQUIRE_OTP" == "true" ]]; then
  REQUIREMENT="REQUIRED"
else
  REQUIREMENT="DISABLED"
fi
BROWSER_CONDITIONAL_OTP=$(echo "$GET_BROWSER_EXECUTIONS" | jq -r '.[] | select(.displayName=="Browser - Conditional OTP") | .requirement = "'$REQUIREMENT'"')

#Update conditional OTP browser flow execution
UPDATE_BROWSER_EXECUTION=$(curl -s -L -X PUT "$UPDATE_REALM_URL"/master/authentication/flows/browser/executions \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
--data-raw "$BROWSER_CONDITIONAL_OTP")

if [ -z "$UPDATE_BROWSER_EXECUTION" ]
then
	echo "Realm master updated successfully"
else
  #In case of error, print the error and exit in order to avoid successfully logging the script execution
  echo "Realm master updated failed"
  exit;
fi
