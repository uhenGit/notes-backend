## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Environment settings
- create .env file in the root directory
- set variable X-API-KEY to your key (will be using in the X-API-HEADER as value in the testing requests)
- set variable DB_CONFIG to your MongoDB Atlas connection uri


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Endpoints
### All the requests should start with 'http://localhost:3000/notes'
- '/add' is to create new note
- '/all' is to list all existing notes
- '/one/:id' returns note by provided id
- '/update/:id' updates note by provided id
- '/delete/:id' deletes note by provided id
- '/filter/?tag=<tag_name>' returns a list of notes filtered by provided tag (the /?tag=<tag_name>&tag=<tag_name> is also supports)

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
