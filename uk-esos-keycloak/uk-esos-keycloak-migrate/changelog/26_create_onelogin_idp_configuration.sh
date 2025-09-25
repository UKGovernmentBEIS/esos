#!/bin/bash

SCRIPT_NAME=$(basename -- "$0")

set -e

#Variables Declaration
UPDATE_REALM_URL="$BASE_URL/admin/realms/"

#Get Keyclok Admin Access Token using method from imported functions script
KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)

# Create GOVUK ONE LOGIN Identity Provider
CREATE_ONELOGIN_IDP=$(curl -s -L -X POST "$UPDATE_REALM_URL$UK_ESOS_REALM_NAME"/identity-provider/instances \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
--data-raw '
{
  "alias": "'$ONE_LOGIN_IDP_ALIAS'",
  "displayName": "GOVUK One Login",
  "providerId": "oidc",
  "enabled": true,
  "updateProfileFirstLoginMode": "on",
  "trustEmail": false,
  "storeToken": true,
  "addReadTokenRoleOnCreate": true,
  "authenticateByDefault": false,
  "linkOnly": false,
  "hideOnLogin": false,
  "config": {
    "tokenUrl": "'$ONELOGIN_BASE_URL'/token",
    "acceptsPromptNoneForwardFromClient": "true",
    "jwksUrl": "'$ONELOGIN_BASE_URL'/.well-known/jwks.json",
    "isAccessTokenJWT": "true",
    "filteredByClaim": "false",
    "jwtX509HeadersEnabled": "false",
    "backchannelSupported": "false",
    "caseSensitiveOriginalUsername": "false",
    "issuer": "'$ONELOGIN_BASE_URL'/",
    "loginHint": "true",
    "clientAuthMethod": "private_key_jwt",
    "clientAssertionSigningAlg": "RS256",
    "syncMode": "LEGACY",
    "allowedClockSkew": "0",
    "defaultScope": "openid email phone",
    "userInfoUrl": "'$ONELOGIN_BASE_URL'/userinfo",
    "validateSignature": "true",
    "clientId": "'$ONELOGIN_CLIENT_ID'",
    "uiLocales": "false",
    "disableNonce": "false",
    "useJwksUrl": "true",
    "sendClientIdOnLogout": "true",
    "metadataDescriptorUrl": "'$ONELOGIN_BASE_URL'/.well-known/openid-configuration",
    "pkceEnabled": "true",
    "pkceMethod": "S256",
    "forwardParameters": "vtr=[Cl.Cm]",
    "authorizationUrl": "'$ONELOGIN_BASE_URL'/authorize",
    "disableUserInfo": "false",
    "logoutUrl": "'$ONELOGIN_BASE_URL'/logout",
    "sendIdTokenOnLogout": "true",
    "passMaxAge": "false"
  }
}')

if [ -z "$CREATE_ONELOGIN_IDP" ]
then
	echo " GOVUK One Login IDP created successfully"
else
	#In case of error during realm creation, print the error and exit in order to avoid successfully loging the script execution
	echo " $CREATE_ONELOGIN_IDP"
	exit;
fi

##########################################################################################################################################################################

IDP_REDIRECTOR_EXECUTION_ID=$(getIdentityProviderRedirectorExecutionId "$ESOS_BROWSER")
checkExitCode $? $SCRIPT_NAME
SET_ONE_LOGIN_IDP_DEFAULT=$(setConfigurationForExecution $IDP_REDIRECTOR_EXECUTION_ID "govuk-one-login-redirector" "defaultProvider" "$ONE_LOGIN_IDP_ALIAS")
checkExitCode $? $SCRIPT_NAME
SET_ONE_LOGIN_IDP_REQUIRED=$(setRequirementForExecution $ESOS_BROWSER $IDP_REDIRECTOR_EXECUTION_ID 25 "REQUIRED")
checkExitCode $? $SCRIPT_NAME
echo "GOVUK One Login IDP set as default and required for ESOS Browser authentication flow"

##########################################################################################################################################################################

#Add script name as user to changelog realm for tracking purposes
ADD_SCRIPT_TO_CHANGELOG=$(addUserToChangeLogRealm "$SCRIPT_NAME")

if [ -z "$ADD_SCRIPT_TO_CHANGELOG" ]
then
	echo " Script $SCRIPT_NAME added to changelog"
else
	echo " Script $SCRIPT_NAME was not to added to changelog. Reason: $ADD_SCRIPT_TO_CHANGELOG"
fi