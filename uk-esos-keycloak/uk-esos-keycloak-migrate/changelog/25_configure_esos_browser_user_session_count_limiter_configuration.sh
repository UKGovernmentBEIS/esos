#!/bin/bash

#This script updates user session limits execution configuration of ESOSBrowser authentication flow.

SCRIPT_NAME=$(basename -- "$0")

set -e

#Variables Declaration
UPDATE_REALM_URL="$BASE_URL/admin/realms/"

#Get Keyclok Admin Access Token using method from imported functions script
KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)

#Get ESOS Browser user session limits execution id
GET_ESOS_BROWSER_EXECUTIONS=$(curl -s -L -X GET "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME"/authentication/flows/"$ESOS_BROWSER"/executions \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN")

USER_SESSION_LIMITS_ID=$(echo "$GET_ESOS_BROWSER_EXECUTIONS" | jq -r '.[] | select(.providerId=="user-session-limits").id')

#Update user session limits configuration execution
CONFIGURE_SESSION_LIMITS_EXECUTION=$(curl -s -L -X POST "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME"/authentication/executions/"$USER_SESSION_LIMITS_ID"/config \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
--data-raw '{
	"alias": "ESOSUserSessionCountLimiter",
    "config": {
        "userClientLimit": "1",
        "behavior": "Terminate oldest session",
        "userRealmLimit": "0"
    }
}')

if [ -z "$CONFIGURE_SESSION_LIMITS_EXECUTION" ]
then
	echo " Realm $UK_ESOS_REALM_NAME updated successfully"
else
	#In case of error during realm creation, print the error and exit in order to avoid successfully loging the script execution
	echo " Realm $UK_ESOS_REALM_NAME updated failed"
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
