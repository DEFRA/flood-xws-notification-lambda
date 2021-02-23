# notification-api

Notification worker queues and webhooks

# Environment variables

| name                     | description                | required   | default   | valid                         | notes   |
| ----------               | ------------------         | :--------: | --------- | :---------------------------: | ------- |
| NODE_ENV                 | Node environment           | no         |           | dev,test,prod                 |         |
| ENV                      | Deployment environment     | yes        |           | local,sandbox,test,production |         |
| HOST                     | Hostname                   | yes        |           |                               |         |
| PORT                     | Port number                | yes        |           |                               |         |
| NOTIFY_API_KEY           | Notify API key             | yes        |           |                               |         |
| NOTIFY_SMS_TEMPLATE_ID   | Notify SMS template id     | yes        |           |                               |         |
| NOTIFY_EMAIL_TEMPLATE_ID | Notify Email template id   | yes        |           |                               |         |
| NOTIFY_BEARER_TOKEN      | Notify bearer token        | yes        |           |                               |         |
| DATABASE_URL             | Database connection string | yes        |           |                               |         |

As per [12 Factor principles](https://12factor.net/config) application config is stored in environment variables (env vars). For ease of local development the service should have a `.env` file in its root folder. Starter `.env` files for local development this service are held in the [https://github.com/NeXt-Warning-System/config/notification-api]() repository.

Notes:
* Env var values defined in the docker-compose service override those defined in the `.env` file. See the override of the PORT env var as an example.
* `.env` files should not be committed to the service repository.
* `.env` files should not be used in production.

# Prerequisites

Node v12+

# Running the service

`docker-compose up --build`

# Stopping the service

CTRL-C or run `docker-compose down` from another session

# Testing

## All testing

`docker-compose run notification-api npm test`

## Unit testing only

`docker-compose run notification-api npm run unit-test`

## Linting only

`docker-compose run notification-api npm run lint`

# Key frameworks used

- [hapijs](https://github.com/hapijs/hapi) - The framework & core plugins like `joi`, `vision` etc.
- [standardjs](http://standardjs.com/) - Linting
- [lab](https://github.com/hapijs/lab) - unit testing
- [code](https://github.com/hapijs/code) - code coverage

# Deploying

Deployments are to GOV.UK Platform as a Service and are done using Github actions which deploy to the sandbox envirnoment on every merge to master.

The deployments are to the xws-notification-service-api app in the sandbox space in the defra-next-warning-system organisation and are accessible at [https://xws-notification-api-sandbox.london.cloudapps.digital/.](). Developers will need a login for [https://login.london.cloud.service.gov.uk/login]() to allow access to logs and diagnostic details which can't be retrieved using the cloudfoundry CLI.

## License

Contains public sector information licensed under the [Open Government license v3](./LICENCE)
