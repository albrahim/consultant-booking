## User signup:
* endpoint: ```/user/signup```
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
* endpoint: ```/user/login```
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
* endpoint: ```/profile```
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
* endpoint: ```/profile```
* method: PUT
* header: ```Authorization: <token>```

### request:
```
{
    "firstName": <firstName optional>,
    "lastName": <lastName optional>,
    "major": <major optional>,
    "gender": <gender either "male" or "female" optional>,
    "sessionTime": {
        "acceptableHours": [
            {"startHour": 2, "startMinute": 0, "endHour": 22, "endMinute": 0}
        ],
        "maximumMinutesPerSession": 120
    }
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
* endpoint: ```/user/id```
* method: GET
* header: ```Authorization: <token>```

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
* endpoint: ```/user/id```
* method: PATCH
* header: ```Authorization: <token>```

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
* endpoint: ```/user/id```
* method: DELETE
* header: ```Authorization: <token>```

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
* endpoint: ```/profile/<another user's id>```
* method: GET
* header: ```Authorization: <token>```

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

## Reserve a session:
* endpoint: ```/book/```
* method: POST
* header: ```Authorization: <token>```

### request:
```
{
    "consultantId": <consultant id>,
    "startTime": <start time>,
    "endTime": <end time>
}
```

### response:
```
{
    "success": "Booking successful",
    "id": <booking id>,
    "consultant": <consultant id>,
    "trainee": <trainee id>,
    "startTime": <start time>,
    "endTime": <end time>
}
```
#### if one of the fields in the request is missing:
```
{
    "fail": "Invalid request"
}
```
#### if the start time already passed:
```
{
    "fail": "Invalid start time"
}
```
#### if the start time doesn't come before the end time:
```
{
    "fail": "Invalid start time and end time"
}
```
#### if the user id is wrong:
```
{
    "fail": "Invalid user id"
}
```
#### if booking session with user who didn't set consultation time:
```
{
    "fail": "This user is not a consultant"
}
```
#### if booking session time outside consultation time set by the consultant:
```
{
    "fail": "Invalid booking time for this consultant"
}
```
#### if booking session duration excedes maximum duration set by consultant:
```
{
    "fail": "Invalid session duration for this consultant"
}
```
#### if the consultant has another session at the same time:
```
{
    "fail": "Conflict with another consultant session"
}
```
#### if the trainee has another session at the same time:
```
{
    "fail": "Conflict with another trainee session"
}
```

