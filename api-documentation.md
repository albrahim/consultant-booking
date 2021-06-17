User signup:
endpoint: /user/signup
method: POST
request:
{
    "email": <email>,
    "password": <password>
}

response:
if user signup successfully:
{
    "message": "User created",
    "user": {
        "email": <email>,
        "password": <password>,
        "signupAt": "2021-06-17T08:24:28.523Z",
        "lastLoginAt": "2021-06-17T08:24:28.523Z"
    }
}

if email already exists:
{
    "message": "Email already exists"
}

if password not provided:
{
    "message": "Password cannot be empty"
}

User login:
endpoint: /user/login
method: POST
request:
{
    "email": <email>,
    "password": <password>
}

response:
if login successful:
{
    "message": "Auth successful",
    "token": <login token>,
    "user": {
        "email": <email>,
        "signupAt": "2021-06-17T08:06:58.275Z",
        "lastLoginAt": "2021-06-17T08:26:49.513Z"
    }
}

if wrong password or email:
{
    "message": "Invalid login"
}

User profile information:
endpoint: /profile
method: GET
header: Authorization: <token>

response:
if logged in:
{
    "fullName": <fullName optional>,
    "gender": <gender either "male" or "female" optional>,
    "major": <major optional>
}
if not logged in:
{
    "message": "Auth failed"
}

Change user profile information:
endpoint: /profile
method: PUT
header: Authorization: <token>

request:
{
    "fullName": <fullName optional>,
    "major": <major optional>,
    "gender": <gender either "male" or "female" optional>
}

response:
if changed successfully:
{
    "message": "Profile Updated"
}

if wrong gender value provided:
{
    "errors": {
        "gender": {
            "name": "ValidatorError",
            "message": "`` is not a valid enum value for path `gender`.",
            "properties": {
                "message": "`` is not a valid enum value for path `gender`.",
                "type": "enum",
                "enumValues": [
                    "male",
                    "female"
                ],
                "path": "gender",
                "value": ""
            },
            "kind": "enum",
            "path": "gender",
            "value": ""
        }
    },
    "_message": "Profile validation failed",
    "name": "ValidationError",
    "message": "Profile validation failed: gender: `` is not a valid enum value for path `gender`."
}

if not logged in:
{
    "message": "Auth failed"
}

Login information:
endpoint: /user/id
method: GET
header: Authorization: <token>

response:
{
    "email": <email>,
    "id": <id>,
    "signupAt": <date>,
    "lastLoginAt": <date>
}

Change login information:
endpoint: /user/id
method: PATCH
header: Authorization: <token>

request:
{
    "email": <email optional>,
    "password": <password optional>,
}

response:
{
    "message": "Updated successfully"
}