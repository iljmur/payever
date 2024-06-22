Description
payever test assignment: rest api application

Dependencies prerequisites
- use TypeScript 3.4 and above. 
- use NestJS Framework, https://docs.nestjs.com/ 
- use MongoDB 4.4 and above 
- use RabbitMQ 3.7 and above

# API Endpoints
Below are the available API endpoints:

### Create a User
POST /api/users
- Request Body:

```
{
  "id": "string",
  "email": "string",
  "fist_name": "string",
  "last_name": "string
}
```
  - Responses:
  - [201 Created]
```
{
    "status": "success",
    "message": "User has been created."
}
```
  - [409 Conflict]
```
{
    "status": "failed",
    "message": "User already exists."
}
```

### Retrieve a User by ID
GET /api/user/
- Retrieve a user by their ID.
- Responses:
- [200 OK]
```
{
    "data": {
        "id": ***,
        "email": "de@de.de",
        "first_name": "Max",
        "last_name": "Musterman",
        "avatar": "https://reqres.in/img/faces/***"
    }
}
```

### Retrieve User's Avatar
GET /api/user/:id/avatar
- Retrieve the avatar of a user by their ID.
- Responses:
- [200 OK]
```
{
  "data": "base64EncodedAvatar"
}
```
- [404 Not Found] if user not found
```
{
    "message": "Failed to fetch user from reqres using id:***",
    "error": "Not Found",
    "statusCode": 404
}
```

### Delete User's Avatar
DELETE /api/user/:id/avatar

- Responses:
- [200 OK]
```
{
    "status": "success",
    "message": "Avatar has been deleted."
}
```
- [404 Not Found] if user not found
```
{
    "message": "Unable to delete avatar: avatar with reqres id 2 not found",
    "error": "Not Found",
    "statusCode": 404
}
```


# Installation
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
Test
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov