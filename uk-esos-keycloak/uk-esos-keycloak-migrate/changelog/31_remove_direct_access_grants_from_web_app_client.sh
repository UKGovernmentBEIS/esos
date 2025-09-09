#!/usr/bin/python3

import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import common

script_name = os.path.basename(__file__)

uk_esos_web_app_client = common.get_client_for_realm(common.esos_realm_name, "uk-esos-web-app")
uk_esos_web_app_client['directAccessGrantsEnabled'] = False
common.update_client_for_realm(common.esos_realm_name, uk_esos_web_app_client['id'], uk_esos_web_app_client)

print("Disabled direct access grants for uk-esos-web-app client")

common.add_script_to_changelog(script_name)