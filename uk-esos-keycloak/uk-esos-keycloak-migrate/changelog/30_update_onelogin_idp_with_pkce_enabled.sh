#!/usr/bin/python3

import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import common

script_name = os.path.basename(__file__)

one_login_idp = common.get_identity_provider_for_realm(common.esos_realm_name, common.one_login_idp_alias)
one_login_idp["config"]["pkceEnabled"] = "true"
one_login_idp["config"]["pkceMethod"] = "S256"

common.update_identity_provider_for_realm(common.esos_realm_name, common.one_login_idp_alias, one_login_idp)
common.add_script_to_changelog(script_name)

print(f"Updated OneLogin IDP to enable PKCE")