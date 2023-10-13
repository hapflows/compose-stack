# compose-stack

compose-stack is a project starter that offers a production-ready
configuration leveraging:

- [`FastAPI`](https://fastapi.tiangolo.com/): Python web framework
- [`PostgreSQL`](https://www.postgresql.org/): World's most advanced relational DB
- [`SQLAlchemy 2`](https://www.sqlalchemy.org/): Python SQL toolkit
- [`Alembic`](https://alembic.sqlalchemy.org/en/latest/): SQLAlchemy migration tool
- [`AsyncPG`](https://magicstack.github.io/asyncpg/current/): Async PostgreSQL interface
- [`Next.js`](https://nextjs.org/): the React framework for the Web (to be added)
- [`NewRelic`](https://newrelic.com/): Observability platform (to be added)
- [`Playwright`](https://playwright.dev/): Observability platform (to be added)

Additionally, it comes with built-in features:

- Users table with registration, verification, authentication and password reset
- Failed login limit to prevent password brute forcing
- Notifications (emails) setup and ready to be used with
  [MailerSend](https://www.mailersend.com/) (which has a generous free tier)
- Feature flags setup (one available, to control if new users can register or not)
- Four frontend main packages, loosely based on
  [`borrow-ui`](https://www.borrow-ui.dev):
  - UI components package, to develop reusable components, styled with
    [`scss`](https://sass-lang.com/)
  - A documentation package based on Storybook
  - App based on Next.js, with home page, user registration, logged in page, and user
    password reset form
  - Website based on Next.js and MDX
- High test coverage, with backend API tests, frontend unit tests and
  automated comprehensive integration tests.

The out-of-the-box setup allows to prototype applications that requires users
registration quickly with latest technology based on Python and React.

## Installation

Requirements:

- `docker`
- (optional) a Python virtual environment (`compose-stack`) to initialise
  the services and for native VSCode environment

### Native Installation

```sh
python3 -m venv compose-stack
source compose-stack/bin/activate
pip install -r backend/requirements.txt -r backend/requirements_dev.txt
```

## Build & Run

### First run

The first time the containers are created the environment
needs to be setup.
Before running "build & run", run the following command:

```sh
. docker/initialise_dev.sh
```

This commands creates the necessary folders mapped in the docker
configuration file.

### Backend

```sh
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.dev.yml exec compose-stack-backend-dev alembic upgrade head
```

### Frontend

Despite being available (but commented) on the docker-compose file,
it's much easier to develop the frontend natively without an image:

```sh
cd frontend
yarn dashboard:dev
```

For other frontend commands, see the `README` file inside the
`frontend` folder.

### Tests (great for TDD)

```sh
# run once or whenever a dependency change
docker-compose -f docker-compose.test.yml build
# run the tests
docker-compose -f docker-compose.test.yml up --exit-code-from compose-stack-api-test
```

## System bootstrap

The bootstrap phase will:

- create Postgres database and tables

Run:

```sh
docker-compose -f docker-compose.dev.yml exec compose-stack-backend-dev alembic upgrade head
```

## Backend documentation

Once the containers are built and the application is started,
the backend documentation should be available here:

[`http://localhost:8150/docs`](http://localhost:8150/docs)

# Production

Similarly to Dev environment, production needs to be initialised and built too:

```sh
. docker/initialise_prod.sh
docker-compose -f docker-compose.prod.yml build
```

Then, the application can be launched with:

```sh
docker-compose -f docker-compose.prod.yml up -d
```

#### Note

The nginx configuration and environment variables are tailored to run on `compose-stack.com` domain,
so they need to be changed in order to work correctly with your domain.

## Debugging

Different containers can be debugged in different ways.

- To debug a Next.js error, start the container without Demon mode.
- To enter Postgres console, run:
  ```sh
  docker compose -f docker-compose.prod.yml exec compose-stack-postgres-prod bash
  > psql -h 127.0.0.1 -U postgres_user compose_stack
  ```
