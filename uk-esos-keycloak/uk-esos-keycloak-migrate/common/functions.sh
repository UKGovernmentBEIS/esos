#!/bin/bash

#Add Log Message
logMessage(){
	
	MSG=$1
	echo "$(date +'%Y-%m-%d %H:%M:%S,%3N') INFO  [migrate_keycloak] $MSG"
}
export -f logMessage

#Get Access Token From Keycloak Admin User 
getKeycloakAdminAccessToken(){
	#Variables
	CLIENT_ID=admin-cli
	GRANT_TYPE=password
	RETRIEVE_TOKEN_URL="$BASE_URL/realms/master/protocol/openid-connect/token"

	ACCESS_TOKEN=$(curl -s -L -X POST "$RETRIEVE_TOKEN_URL" \
	-H 'Content-Type: application/x-www-form-urlencoded' \
	--data-urlencode "client_id=$CLIENT_ID" \
	--data-urlencode "username=$KEYCLOAK_ADMIN" \
	--data-urlencode "password=$KEYCLOAK_ADMIN_PASSWORD" \
	--data-urlencode "grant_type=$GRANT_TYPE" \
	| jq -r '.access_token')

	echo $ACCESS_TOKEN
}
export -f getKeycloakAdminAccessToken

#Add user to changelog realm
addUserToChangeLogRealm(){
	
	#Variables
	USERNAME=$1
	KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)
	CREATE_REALM_USER_URL="$BASE_URL/admin/realms/$CHANGELOG_REALM_NAME/users"
	
	CREATE_USER=$(curl -s -L -X POST "$CREATE_REALM_USER_URL" \
	-H 'Content-Type: application/json' \
	-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
	--data-raw '{
		"username": "'$USERNAME'",
		"enabled": false
	}')
	
	echo $CREATE_USER
}
export -f addUserToChangeLogRealm

#Retrieve all users of changelog realm as a concatenated string. Realm users represent executed scripts
getChangeLogRealmUsers(){

	#Variables
	KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)
	GET_REALM_USERS_URL="$BASE_URL/admin/realms/$CHANGELOG_REALM_NAME/users"

	USERS=$(curl -s -L -X GET "$GET_REALM_USERS_URL" \
	-H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN")
	
	echo $USERS
}
export -f getChangeLogRealmUsers

#Locks table databasechangeloglock
lockDatabase(){
	#Variables
	KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)
	LOCK_URL="$BASE_URL/realms/master/database-lock"

	IS_LOCK_SUCCESSFUL=$(curl -s -L -X POST "$LOCK_URL" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN" \
  | jq -r '.success // false')

  echo $IS_LOCK_SUCCESSFUL
}
export -f lockDatabase

#Unlocks table databasechangeloglock
unlockDatabase(){
  logMessage "Unlocking database..."

	#Variables
	KEYCLOAK_ADMIN_ACCESS_TOKEN=$(getKeycloakAdminAccessToken)
	UNLOCK_URL="$BASE_URL/realms/master/database-lock"

	curl -s -L -X DELETE "$UNLOCK_URL" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $KEYCLOAK_ADMIN_ACCESS_TOKEN"
}
export -f unlockDatabase

#Attempts to lock the table databasechangeloglock
attemptLockDatabase(){
  IS_LOCK_SUCCESSFUL=$(lockDatabase)

  if [ "$IS_LOCK_SUCCESSFUL" = false ]; then
  	logMessage "Error: Could not lock database. Exiting..."
    exit
  fi
}
export -f attemptLockDatabase
