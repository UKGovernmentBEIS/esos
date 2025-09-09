#!/usr/bin/python3

import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import common

script_name = os.path.basename(__file__)

security_enhancements_profile_name = 'security-enhancements'

all_profiles = common.get_client_policy_profiles_for_realm(common.esos_realm_name)
security_enhancements_profile = {
 'name': security_enhancements_profile_name,
 'description': 'Security enhancements recommended by security testing',
 'executors': [
   {
     'executor': 'secure-session',
     'configuration': {},
   },
   {
     'executor': 'ol-idp-response-mode-enforce',
     'configuration': {
         'responseModesEnforced': [
             'query'
         ]
     }
   }
 ]
}
all_profiles['profiles'].append(security_enhancements_profile)
common.update_client_policy_profiles_for_realm(common.esos_realm_name, all_profiles)

policies = common.get_client_policies_for_realm(common.esos_realm_name)
security_enhancements_policy = {
    "name": "Security enhancements policy",
    "description": "Policy that forces public clients to use nonce and state parameters in their authorization requests",
    "enabled": True,
    "conditions": [
        {
            "condition": "client-access-type",
            "configuration": {
                "is-negative-logic": False,
                "type": [
                    "public"
                ]
            }
        }
    ],
    "profiles": [security_enhancements_profile_name]
}
policies['policies'].append(security_enhancements_policy)
common.update_client_policies_for_realm(common.esos_realm_name, policies)

print("Security enhancements profile and policy added.")

common.add_script_to_changelog(script_name)