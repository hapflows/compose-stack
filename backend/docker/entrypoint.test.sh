#!/bin/sh

echo "Waiting for postgres..."

while ! nc -z $POSTGRES_HOST 5432; do
    sleep 1
    echo "Wait for postgres at $POSTGRES_HOST:5432"
done

echo "PostgreSQL started"

export PYTHONPATH=/home/fastapi_server/fastapi_server

# Destroy previous database
python fastapi_server/init/destroy.py test

# Create database
python fastapi_server/init/bootstrap.py test

# Run migrations with alembic
alembic upgrade head

exec "$@"