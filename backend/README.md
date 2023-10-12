# Backend

The backend server is based on FastAPI, SQLAlchemy, Alembic and AsyncPG.
This means that:

- the web application runs with `uvcorn` with async functionalities;
- it uses PostgreSQL as Database and connects to it via SQLAlchemy
- queries are asynchronous so they need to be awaited
- Alembic manages the database migrations

## Code structure

The main folder contains the server entrypoint file, Alembic models links,
config file that reads the environment variables and all the project folders.

In detail:

- `main.py` contains the `FastAPI` entrypoint file, where all the routes are
  imported and the application is started;
- `config.py` contains the `Settings` values, with PostgreSQL related vars;
- `models.py` imports all the application models so that they can be imported
  in Alembic configuration and changes be auto-discovered, simplifying the
  DB migrations.

The folders are:

- `apps`: includes all modules required for the app to work, from users to
  feature flags to notifications. Each module has a set of files with consistent
  names, as detailed in the next subsection;
- `lib`: includes helpers and utils divided by scope, such as `async-io`, `dates`, etc;
  These files are used within the entire application and have no "internal" dependencies;
- `resources`: required resources definition, such as database related classes and
  functions;
  - `database/postgres.py`: session helper definition
  - `database/databases.py`: centralized helpers that collects all `apps` "databases"
    definitions
- `init`: scripts to initialize the app, used mainly for manual initialization outside
  of Docker;
- `scripts`: helper scripts to interact and change the application state, like adding
  feature flags or manipulating users state (see `Scripts` section below for details)
- `tests`: backend integration tests that leverages `starlette`'s `TestClient`, so we
  can test the APIs with actual calls;

Each app then is structured in the following way (some files might be missing if not
required by the application, like `notification`'s `models`):

- `settings.py`: class that reads environment variables used within the application
- `models.py`: models definition as SQLAlchemy classes
- `schemas.py`: Pydantic classes used in APIs and database definition;
- `database/postgres.py`: Database class definition with all the DB calls required for
  the app to work, such as reading models, creating and manipulating items, counting
  items, etc.
- `entitlements.py`: definitions of helpers used to determine if a user can
  do some actions or not, such as editing an entity. For example, if a user owns a
  To-Do item, a function that validates the ownership. Typically these helpers are
  called in the `api` files
- `core.py`: application business logic, for example transforming a payload into a
  real database item doing the necessary checks
- `api/api.py`: the API file definition, with all the endpoints.

Each application can also have additional files, if required.

# Development lifecycle

To develop new functionalities, usually involving a database, the following operations
are executed in order:

- add a new model to `models.py`
- import the newly created model in the main `models.py` file, then
  create a migration file with Alembic (do not apply!) and rename it with a sequential
  number for easy classification
- add the DB functions to `database/postgres.py` file
- add the logic to the `core.py` file
- add the APIs to `api/api.py`
- add an integration test in the main `tests/integration/<app>` folder
- run the tests and cycle until the functionality is satisfying
- apply the migration and test in the dev Docker instance from the `/docs` endpoint
  (or with tools like `Postman` or `Insomnia`)
- commit the work

# Functionalities

## Feature Flags

To have a dynamic environment, the project uses feature flags.
A feature flag is used to enable or disable a feature for (at the moment) all users.

This is the list of feature flags used in the code:

- `FF_ENABLE_REGISTRATION`: allow new users to register.

Feature flags needs to be created manually in the database.

### Create a feature flag via SQL

Feature flags can be created via scripts (see next section) or via SQL.
To create a FF via SQL, enter PSQL console, then run
(change name of DB depending on environment):

```bash
docker compose -f docker-compose.dev.yml exec compose-stack-postgres-dev bash
  > psql -h 127.0.0.1 -U postgres_user compose_stack_local
```

```sql
INSERT INTO feature_flags (codename, is_active, label) VALUES ('FF_ENABLE_REGISTRATION', True, 'Enable Registration');
```

## Scripts

To run a script, launch a bash session in the docker container:

```bash
 docker-compose -f docker-compose.dev.yml exec compose-stack-dev bash
 cd fastapi_server;
```

Or, for production (note: do not `cd` here):

```bash
docker compose -f docker-compose.prod.yml exec compose-stack-api-prod sh
```

Then, run the scripts as follow.

### Activate user

This script takes the user email as argument and activates the user.

```bash
PYTHONPATH=/home/fastapi_server/fastapi_server python scripts/activate_user.py user@gmail.com
```

### Reset user password

This script takes two arguments: user email and a new password. The user is also re-activated.

```bash
PYTHONPATH=/home/fastapi_server/fastapi_server python scripts/reset_user_password.py user@gmail.com SuperSecret2!
```

### Create Feature Flags

This scripts allows to create a feature flag, by providing the codename:

```bash
PYTHONPATH=/home/fastapi_server/fastapi_server python scripts/create_feature_flag.py FF_ENABLE_REGISTRATION
```

### Toggle Feature Flags

This scripts allows to toggle the `is_active` attribute of an existing feature flag, by providing the codename:

```bash
PYTHONPATH=/home/fastapi_server/fastapi_server python scripts/toggle_feature_flag.py FF_ENABLE_REGISTRATION
```

# Release process

## docker compose

With docker compose the release process is simple: all the infrastructure is
managed by compose so a single command is sufficient, on the host machine
(that is running the app as daemon):

```bash
git pull
docker compose up --build
```

### Note

If new files are added to any `requirements*` file, the `builder` needs
to be built before building the final images.

```bash
sh scripts/build.builder.sh v0.0.2
```
