FROM ubuntu:latest

WORKDIR /app

RUN \
	echo "Updating apt sources." && \
    apt-get -qq update && \
    echo "Installing required packages." && \
    apt-get -qq install \
        python3 \
        python3-setuptools \
        python3-dev \
        python3-pip \
        postgresql-client \
        postgresql-common \
        curl \
        iputils-ping \
        build-essential \
        apt-transport-https \
        git

# Install Python packages
COPY app/requirements.txt .
RUN \
  echo "Installing python packages..." && \
    pip3 install -U pip && \
    pip3 install -r requirements.txt

# Install NodeJS and NPM
RUN \
  curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
  echo 'deb https://deb.nodesource.com/node_8.x xenial main' > /etc/apt/sources.list.d/nodesource.list && \
  echo 'deb-src https://deb.nodesource.com/node_8.x xenial main' >> /etc/apt/sources.list.d/nodesource.list && \
  apt-get -qq update && \
  apt-get -qq install nodejs

# Install NPM packages
COPY app/package.json .
RUN npm install && npm cache --force clean

# Mount the codebase
ADD app /app

RUN npm run prod

ARG DJANGO_SETTINGS_MODULE=links.settings.prod
ARG DJANGO_SECRET_KEY=not-a-secret
RUN mkdir -p /static/ && ./manage.py collectstatic --noinput
