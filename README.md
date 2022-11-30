# To Do List

A simple to do list application with authentication & authorization support.

Note: this guide is using Docker Compose version 2.

## Deployment

To deploy the server

```
$ docker compose \
  -f docker-compose.yml \
  -f docker-compose.production.yml \
  up -d
```

## Development

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

## Usage

Here are some examples of API call,

- Register as a new user

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

- Log in

```
POST http://localhost/login HTTP/1.1
Content-Type: application/json

{
  "email": "johndoe@example.com",
  "password": "johndoepassword"
}
```

- Log out

```
POST http://localhost/logout HTTP/1.1
```

- Create a new to do
- Get to do list
- Update to do status
- Delete a to do
