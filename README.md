# SKGTech Discord Bot

> Enables onboarding of new users, implements a help screen and various
    other functions.

# How To Install

We use Docker and docker-compose, so you will need to install
the [Docker Desktop][docker-desktop] package
on your local machine.

Once that is done, enter the working directory and type:

```
docker-compose up
```

[More on all `docker-compose` available commands][docker-compose].

## Needed Environment Variables

For local development no environment variables are needed. For any other
environment the following environment variables are required:

-   `POSTGRES_URL` A url with credentials pointing to the data store.

# Development Operations / Maintenance

## Reset Local Database

```
npm run db:reset:local
```

## Running Tests Locally

Use the `jest` command to run all tests or specific ones.

## Update Node Version

When a new node version is available you need to updated it in the following:

-   `/package.json`
-   `/.nvmrc`
-   `/.circleci/config.yml`
-   `/Dockerfile`

# Deployment

TBD

## License

Copyright © SKGTech and Authors, Licensed under ISC.

[docker-compose]: https://docs.docker.com/compose/reference/overview/
[docker-desktop]: https://www.docker.com/products/docker-desktop
