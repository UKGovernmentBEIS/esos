import requests
import os

kc_port = os.environ.get('KC_HTTP_PORT', '8080')
base_url = "http://localhost:{}/auth".format(kc_port)
esos_realm_name = "uk-esos"
admin_realm_name= "master"
esos_browser_flow = "ESOSBrowser"

admin_username = os.environ['KEYCLOAK_ADMIN']
admin_password = os.environ['KEYCLOAK_ADMIN_PASSWORD']

def create_common_headers(access_token):
    return {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }

def get_admin_access_token():
    url = f"{base_url}/realms/{admin_realm_name}/protocol/openid-connect/token"
    data = {
        'grant_type': 'password',
        'client_id': 'admin-cli',
        'username': admin_username,
        'password': admin_password
    }

    response = requests.post(url, data=data)
    response.raise_for_status()

    return response.json()['access_token']

def add_script_to_changelog(script_name):
    url = f"{base_url}/admin/realms/changelog/users"
    payload = {
        "username": script_name,
        "enabled": False
    }
    headers = create_common_headers(get_admin_access_token())
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    print("Script {} added to changelog.".format(script_name))

def update_realm(realm_name, data):
    url = f"{base_url}/admin/realms/{realm_name}"
    headers = create_common_headers(get_admin_access_token())
    response = requests.put(url, headers=headers, json=data)
    response.raise_for_status()

def get_execution_for_flow_by_key_value(flow_id, key, value):
    url = f"{base_url}/admin/realms/{esos_realm_name}/authentication/flows/{flow_id}/executions"
    headers = create_common_headers(get_admin_access_token())
    response = requests.get(url, headers=headers)
    response.raise_for_status()

    try:
        return list(filter(lambda x: x.get(key) == value, response.json()))[0]
    except Exception:
        return { key: value }

def set_requirement_for_execution(flow_id, execution_id, priority, requirement):
    url = f"{base_url}/admin/realms/{esos_realm_name}/authentication/flows/{flow_id}/executions"
    headers = create_common_headers(get_admin_access_token())
    data = {
        'id': execution_id,
        'requirement': requirement,
        'priority': priority
    }
    response = requests.put(url, headers=headers, json=data)
    response.raise_for_status()

    print("Updated execution: ", execution_id, "with requirement: ", requirement)

def get_required_actions(registered=True):
    prefix = "" if registered else "unregistered-"
    url = f"{base_url}/admin/realms/{esos_realm_name}/authentication/{prefix}required-actions"
    headers = create_common_headers(get_admin_access_token())
    response = requests.get(url, headers=headers)
    response.raise_for_status()

    return response.json()

def register_required_action(required_action):
    url = f"{base_url}/admin/realms/{esos_realm_name}/authentication/register-required-action"
    headers = create_common_headers(get_admin_access_token())
    response = requests.post(url, headers=headers, json=required_action)
    response.raise_for_status()

def update_required_action(updated_required_action):
    url = f"{base_url}/admin/realms/{esos_realm_name}/authentication/required-actions/{updated_required_action['alias']}"
    headers = create_common_headers(get_admin_access_token())
    response = requests.put(url, headers=headers, json=updated_required_action)
    response.raise_for_status()
