# pull official base image
FROM python:3.6-alpine

# set work directory
WORKDIR /usr/src/app/django-src

# set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2
RUN apk update \
    && apk add --virtual build-deps gcc musl-dev python3-dev py-pip jpeg-dev zlib-dev \
    && apk add postgresql-dev \
    && pip install psycopg2 

# install dependencies
RUN pip install --upgrade pip
RUN pip install pipenv
COPY ./django-src/Pipfile /usr/src/app/django-src/Pipfile
RUN pipenv install --skip-lock --system --dev

# copy entrypoint.sh
COPY ./entrypoint.sh /usr/src/app/entrypoint.sh

# copy django project
COPY ./django-src/ /usr/src/app/django-src

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

