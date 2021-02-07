# tech-start-challenge-be

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Backend services

Deploy on AWS lambda, using:

-   typescript
-   serverless and serverless-offline
-   webpack
-   Serverless

## Install Dependencies

    npm install --save

## Environment variables

Open `.env` file and add the following env

    DB_NAME=<mongo_db>
    DB_USER=<mongo_db_user>
    DB_PASS=<mongo_db_pwd>

## Starting the server locally offline

    npm run start
    
## Run server in production on AWS lambda :rocket:

First, make sure you have the [serverless platform](https://serverless.com/) installed. Then, execute the following command:

    npm run deploy
