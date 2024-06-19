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
  "last_name": "string,
  "avater": "string"
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
  - [200 OK]
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
  "status": "success",
  "data": {
    "id": "string",
    "email": "string",
    "fist_name": "string",
    "last_name": "string,
    "avater": "string"
  }
}
```

### Retrieve a User's Avatar
GET /api/user/:id/avatar
- Retrieve the avatar of a user by their ID.
- Responses:
- [200 OK]
```
{
  "status": "success",
  "data": "base64EncodedAvatar"
}
```
- [200 OK] 
(if user not found)
```
{
  "status": "failed",
  "message": "User with reqres id: *** not found, unable to proceed with updating avatar. Please create a user first."
}
```
- [200 OK] (if external user not found)
```
{
  "status": "failed",
  "message": "Unable to find reqres user with id:***"
}
```
### Delete a User by ID
DELETE /api/user/:id/avatar
- Delete a user by their ID.
- Responses:
- [200 OK]
```
{
  "status": "success",
  "message": "User has been deleted"
}
```
- [200 OK] (if user not found)
```
{
  "status": "failed",
  "message": "User with reqres id *** not found"
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