#!/usr/bin/python3

import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import common

script_name = os.path.basename(__file__)

unregistered_actions = common.get_required_actions(registered=False)
custom_actions = list(filter(lambda ra: ra['providerId'] in ['OL_IDP_VERIFY_PASSWORD', 'OL_IDP_UPDATE_TOTP'], unregistered_actions))
for action in custom_actions:
    common.register_required_action(action)

registered_actions = common.get_required_actions(registered=True)
verify_password_action = list(filter(lambda ra: ra['alias'] == 'OL_IDP_VERIFY_PASSWORD', registered_actions))[0]
update_otp_action = list(filter(lambda ra: ra['alias'] == 'OL_IDP_UPDATE_TOTP', registered_actions))[0]

verify_password_action['enabled'] = True
verify_password_action['priority'] = 8
update_otp_action['enabled'] = True
update_otp_action['priority'] = 9

common.update_required_action(verify_password_action)
common.update_required_action(update_otp_action)

enabled_actions = [verify_password_action, update_otp_action]
for action in enabled_actions:
    print(f"Enabled required action {action['providerId']} with priority {action['priority']}")
