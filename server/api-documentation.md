## User signup:
* endpoint: /user/signup
* method: POST
### request:
```
{
    "email": <email>,
    "password": <password>
}
```

### response:
#### if user signup successfully:
```
{
    "success": "User created",
    "user": {
        "email": <email>,
        "password": <password>,
        "signupAt": <date>,
        "lastLoginAt": <date>
    }
}
```

#### if email already exists:
```
{
    "fail": "Email already exists"
}
```

#### if password not provided:
```
{
    "fail": "Password cannot be empty"
}
```

## User login:
* endpoint: /user/login
* method: POST
### request:
```
{
    "email": <email>,
    "password": <password>
}
```

### response:
#### if login successful:
```
{
    "success": "Auth successful",
    "token": <login token>,
    "user": {
        "email": <email>,
        "signupAt": <date>,
        "lastLoginAt": <date>
    }
}
```

#### if wrong password or email:
```
{
    "fail": "Invalid login"
}
```

## User profile information:
* endpoint: /profile
* method: GET
* header: Authorization: <token>

### response:
#### if logged in:
```
{
    "firstName": <firstName optional>,
    "lastName": <lastName optional>,
    "gender": <gender either "male" or "female" optional>,
    "major": <major optional>
}
```

#### if not logged in:
```
{
    "fail": "Auth failed"
}
```

## Change user profile information:
* endpoint: /profile
* method: PUT
* header: Authorization: <token>

### request:
```
{
    "firstName": <firstName optional>,
    "lastName": <lastName optional>,
    "major": <major optional>,
    "gender": <gender either "male" or "female" optional>
}
```

### response:
#### if changed successfully:
```
{
    "success": "Profile Updated"
}
```

#### if wrong gender value provided:
```
{{
    "fail": "Wrong gender value provided"
}
```

#### if not logged in:
```
{
    "fail": "Auth failed"
}
```

## Login information:
* endpoint: /user/id
* method: GET
* header: Authorization: <token>

### response:
```
{
    "email": <email>,
    "id": <id>,
    "signupAt": <date>,
    "lastLoginAt": <date>
}
```

#### if not logged in:
```
{
    "fail": "Auth failed"
}
```

## Change login information:
* endpoint: /user/id
* method: PATCH
* header: Authorization: <token>

### request:
```
{
    "email": <email optional>,
    "password": <password optional>,
}
```

### response:

#### changed successfully:
```
{
    "success": "Updated successfully"
}
```

#### invalid email provided:
```
{
    "fail": "Invalid email"
}
```

#### empty password provided:
```
{
    "fail": "Password cannot be empty"
}
```

#### provided email used by another account:
```
{
    "fail": "Email already in use"
}
```

#### if not logged in:
```
{
    "fail": "Auth failed"
}
```


## Delete user's account:
* endpoint: /user/id
* method: DELETE
* header: Authorization: <token>

### response:
```
{
    "success": "Deleted successfully"
}
```

#### if not logged in:
```
{
    "fail": "Auth failed"
}
```

## Another user profile information:
* endpoint: /profile/<another user's id>
* method: GET
* header: Authorization: <token>

### response:
#### if user exists:
```
{
    "firstName": <firstName optional>,
    "lastName": <lastName optional>,
    "gender": <gender either "male" or "female" optional>,
    "major": <major optional>
}
```

#### if user doesn't exist:
```
{
    "fail": "User doesn't exist"
}
```

#### if not logged in:
```
{
    "fail": "Auth failed"
}
```