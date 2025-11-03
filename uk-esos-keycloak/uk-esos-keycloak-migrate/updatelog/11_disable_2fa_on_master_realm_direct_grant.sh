#!/bin/bash

#This script enables OTP for master realm direct grant authentication flow.

SCRIPT_NAME=$(basename -- "$0")

set -e

#Variables Declaration
UPDATE_REALM_URL="$BASE_URL/admin/realms/"

#Get Keycloak Admin Access Token using method from imported functions script
KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)

#Get list of direct grant executions
GET_DIRECT_GRANT_EXECUTIONS=$(curl -s -L -X GET "$UPDATE_REALM_URL"/master/authentication/flows/direct%20grant/executions \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN")

#Find direct grant flow and mark it as disabled
DIRECT_GRANT_CONDITIONAL_OTP=$(echo "$GET_DIRECT_GRANT_EXECUTIONS" | jq -r '.[] | select(.displayName=="Direct Grant - Conditional OTP") | .requirement = "DISABLED"')

#Update conditional OTP direct grant flow execution
UPDATE_DIRECT_GRANT_EXECUTION=$(curl -s -L -X PUT "$UPDATE_REALM_URL"/master/authentication/flows/direct%20grant/executions \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
--data-raw "$DIRECT_GRANT_CONDITIONAL_OTP")


if [ -z "$UPDATE_DIRECT_GRANT_EXECUTION" ]
then
	echo "Realm master updated successfully"
else
  #In case of error, print the error and exit in order to avoid successfully logging the script execution
  echo "Realm master updated failed"
  exit;
fi
