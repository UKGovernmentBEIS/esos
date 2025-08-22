#!/bin/bash

SCRIPT_NAME=$(basename -- "$0")

set -e

#Variables Declaration
UPDATE_REALM_URL="$BASE_URL/admin/realms/"

#Get Keyclok Admin Access Token using method from imported functions script
KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)

#Create new realm
UPDATE_UK_ESOS_REALM=$(curl -s -L -X PUT "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME" \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
--data-raw '{
	"id": "'$UK_ESOS_REALM_NAME'",
	"realm": "'$UK_ESOS_REALM_NAME'",
	"displayName": "'$UK_ESOS_REALM_DISPLAY_NAME'"
}')

if [ -z "UPDATE_UK_ESOS_REALM" ]
then
	echo " Realm $UK_ESOS_REALM_NAME updated successfully"
else
	#In case of error during realm creation, print the error and exit in order to avoid successfully loging the script execution
	echo " $CREATE_REALM"
	exit;
fi
