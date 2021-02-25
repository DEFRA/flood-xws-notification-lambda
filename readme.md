# notification

AWS core notification engine resources.

# Environment variables

| name                     | description                | required   | default   | valid                         | notes   |
| ----------               | ------------------         | :--------: | --------- | :---------------------------: | ------- |
| NODE_ENV                 | Node environment           | no         |           | dev,test,prod                 |         |


As per [12 Factor principles](https://12factor.net/config) application config is stored in environment variables (env vars). For ease of local development the service should have a `.env` file in its root folder. Starter `.env` files for local development this service are held in the [https://github.com/NeXt-Warning-System/config/notification-api]() repository.

Notes:
* Env var values defined in the docker-compose service override those defined in the `.env` file. See the override of the PORT env var as an example.
* `.env` files should not be committed to the service repository.
* `.env` files should not be used in production.

# Prerequisites

Node v12+

# Deploying the service

This will deploy the CloudFormation stack.

The `--aws-profile` argument defaults to `default`.
The `--stage` argument defaults to `dev`.

`npx serverless deploy --aws-profile <aws-profile-name> --stage <custom-stage>`

This will deploy the s3 assets

`npx serverless s3deploy --aws-profile <aws-profile-name>`

# Deploying a single function

`npx serverless deploy function -f <function-name> --aws-profile <aws-profile-name> --stage <custom-stage>`

# Removing the stack

`npx serverless remove --aws-profile <aws-profile-name> --stage <custom-stage>`

# Testing

## All testing

`npm test`

## Linting only

`npm run lint`


## License

Contains public sector information licensed under the [Open Government license v3](./LICENCE)
