#!/usr/bin/python3

import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import common

script_name = os.path.basename(__file__)

payload = {
  "accessCodeLifespanLogin": 60 * 30,
  "accessCodeLifespanUserAction": 60 * 8,
  "ssoSessionIdleTimeout": 60 * 90,
  "attributes": {
    "actionTokenGeneratedByUserLifespan.verify-email": str(60 * 60 * 24 * 4),
  },
}

common.update_realm(realm_name=common.esos_realm_name, data=payload)
print("Realm settings for OneLogin updated successfully")

common.add_script_to_changelog(script_name)