#!/bin/bash

#This script updates the uk-esos realm in order to disabled client account console.

SCRIPT_NAME=$(basename -- "$0")

set -e

KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)
CLIENTS_URL="$BASE_URL/admin/realms/$UK_ESOS_REALM_NAME/clients"
CLIENTS_LIST=$(curl -s -L -X GET "$CLIENTS_URL" \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN")
ACCOUNT_CONSOLE_CLIENT_ID=$(echo "$CLIENTS_LIST" | jq -r '.[] | select(.clientId=="account-console").id')

KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)
DISABLE_ACCOUNT_CONSOLE_CLIENT_URL="$BASE_URL/admin/realms/$UK_ESOS_REALM_NAME/clients/$ACCOUNT_CONSOLE_CLIENT_ID"
DISABLE_ACCOUNT_CONSOLE=$(curl -s -L -X PUT "$DISABLE_ACCOUNT_CONSOLE_CLIENT_URL" \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
--data-raw '{
  "enabled":false
}')

if [ -z "$DISABLE_ACCOUNT_CONSOLE" ]
then
	echo "Realm $UK_ESOS_REALM_NAME updated successfully"
else
	echo "$DISABLE_ACCOUNT_CONSOLE"
	exit;
fi

#Add script name as user to changelog realm for tracking purposes
ADD_SCRIPT_TO_CHANGELOG=$(addUserToChangeLogRealm "$SCRIPT_NAME")

if [ -z "$ADD_SCRIPT_TO_CHANGELOG" ]
then
	echo " Script $SCRIPT_NAME added to changelog"
else
	echo " Script $SCRIPT_NAME was not to added to changelog. Reason: $ADD_SCRIPT_TO_CHANGELOG"
fi
