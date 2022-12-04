# To Do List

A simple to do list application with authentication & authorization support.
Surely tt has input validation feature as well. Jump to usage section below
for ideal example.

Note: this guide is using Docker Compose version 2.

## Usage

Here are some examples of API call,

### Register as A New User

```
POST http://localhost/register HTTP/1.1
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com",
  "password": "johndoepassword"
}
```

### Log In

```
POST http://localhost/login HTTP/1.1
Content-Type: application/json

{
  "email": "johndoe@example.com",
  "password": "johndoepassword"
}
```

### Log Out

```
POST http://localhost/logout HTTP/1.1
```

### Create a Aew To Do

```
POST http://localhost/todo HTTP/1.1
Content-Type: application/json

{
  "name": "Task 1",
  "description": "This is the task 1",
  "dueDate": "2022-12-10",
  "status": "inbox",          // "inbox", "ongoing", "done"
  "assigneeId": 1             // assigneeId is any ID of registered user
}
```

### Get To Do List
### Update To Do Fields

```
PUT http://localhost/todo/{id} HTTP/1.1
Content-Type: application/json

{
  "description": "New description",
  "status": "done"            // "inbox", "ongoing", "done"
}
```

### Delete a To Do

```
DELETE http://localhost/todo/{id} HTTP/1.1
```

## Deployment

To deploy the server

```
$ docker compose \
  -f docker-compose.yml \
  -f docker-compose.production.yml \
  up -d
```

## Development and Test

Start PostgreSQL server using Docker for convenience.

```
$ docker compose \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  up -d \
  postgres
```

Then copy and/or adjust environment variables to `.env` for Express app.
```
$ cp .env.example .env
$ npm ci
$ npm test
$ npm run build
$ npm start
```
