#!/bin/bash

SCRIPT_NAME=$(basename -- "$0")

set -e

UPDATE_REALM_URL="$BASE_URL/admin/realms/"

KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)
realm=$(curl -s -L -X GET "$BASE_URL"/admin/realms/uk-esos \
 -H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN")

updated_realm=$(echo "$realm" | jq -r '.eventsListeners += ["ol-idp-event-listener"]')

updated_realm_response=$(curl -s -L -X PUT "$BASE_URL"/admin/realms/uk-esos \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
  --data-raw "$updated_realm")

if [[ -z "$updated_realm_response" ]]; then
  echo "GOVUK One Login IDP event listener added successfully."
else
  echo "Failed to add GOVUK One Login IDP event listener. Response: $updated_realm_response"
  exit 1
fi

# Add script name as user to changelog realm for tracking purposes
ADD_SCRIPT_TO_CHANGELOG=$(addUserToChangeLogRealm "$SCRIPT_NAME")
if [[ -z "$ADD_SCRIPT_TO_CHANGELOG" ]]; then
  echo "Script $SCRIPT_NAME added to changelog."
else
  echo "Script $SCRIPT_NAME was not added to changelog. Reason: $ADD_SCRIPT_TO_CHANGELOG"
fi