NestJS Application
Welcome to the NestJS application! This document provides an overview of the project, instructions for setting up the development environment, running the application, and detailed descriptions of the available API endpoints.

Table of Contents
Introduction
Prerequisites
Installation
Running the Application
Testing
API Endpoints
Project Structure
Contributing
License
Introduction
This is a typical NestJS application designed to manage user information, including user registration, retrieval, avatar management, and deletion. NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

Prerequisites
Ensure you have the following installed on your development machine:

Node.js (version 14.x or later)
npm (version 6.x or later) or yarn (version 1.x or later)
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/your-repository.git
Navigate to the project directory:

bash
Copy code
cd your-repository
Install the dependencies:

Copy code
npm install
or

Copy code
yarn install
Running the Application
To start the application, run the following command:

arduino
Copy code
npm run start
or

sql
Copy code
yarn start
The application will be available at http://localhost:3000.

Testing
To run the tests, use the following command:

arduino
Copy code
npm run test
or

bash
Copy code
yarn test
To run the end-to-end (E2E) tests:

arduino
Copy code
npm run test:e2e
or

bash
Copy code
yarn test:e2e
To run the tests in watch mode:

arduino
Copy code
npm run test:watch
or

bash
Copy code
yarn test:watch
API Endpoints
Below are the available API endpoints:

Create a User
POST /api/users
Create a new user.
Request Body:
json
Copy code
{
  "id": "string",
  "email": "string"
}
Responses:
201 Created
json
Copy code
{
  "status": "success",
  "message": "User has been created."
}
200 OK
json
Copy code
{
  "status": "failed",
  "message": "User already exists."
}
Retrieve a User by ID
GET /api/user/
Retrieve a user by their ID.
Responses:
200 OK
json
Copy code
{
  "status": "success",
  "data": {
    "id": "string",
    "email": "string",
    ...
  }
}
Retrieve a User's Avatar
GET /api/user/
/avatar
Retrieve the avatar of a user by their ID.
Responses:
200 OK
json
Copy code
{
  "status": "success",
  "data": "base64EncodedAvatar"
}
200 OK (if user not found)
json
Copy code
{
  "status": "failed",
  "message": "User with reqres id:123 not found, unable to proceed with updating avatar. Please create a user first."
}
200 OK (if external user not found)
json
Copy code
{
  "status": "failed",
  "message": "Unable to find reqres user with id:123"
}
Delete a User by ID
DELETE /api/user/
/avatar
Delete a user by their ID.
Responses:
200 OK
json
Copy code
{
  "status": "success",
  "message": "User has been deleted"
}
200 OK (if user not found)
json
Copy code
{
  "status": "failed",
  "message": "User with reqres id 123 not found"
}

