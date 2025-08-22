#!/usr/bin/python3

import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import common

executions_to_update = [
    common.get_execution_for_flow_by_key_value(flow_id=common.esos_browser_flow,
                                               key="displayName",
                                               value="ESOSBrowser Organization"),
    common.get_execution_for_flow_by_key_value(flow_id=common.esos_browser_flow,
                                               key="displayName",
                                               value="ESOSBrowser forms")
]

for execution in executions_to_update:
    if ("id" not in execution):
        print(f"Execution not found for flow {common.esos_browser_flow} with key 'displayName' and value '{execution['displayName']}'")
        continue
    common.set_requirement_for_execution(flow_id=common.esos_browser_flow, execution_id=execution['id'], priority=execution['priority'], requirement="DISABLED")

print("Updated requirement for unneeded auth subflows to DISABLED")
