import requests
import json

# Test login
response = requests.post(
    'http://localhost:8000/api/auth/login/',
    json={
        'username': 'admin',
        'password': 'admin'
    }
)

print("Status Code:", response.status_code)
print("Response:", json.dumps(response.json(), indent=2))
