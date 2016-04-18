FROM node:4.2.6

RUN apt-get update -qq
RUN apt-get install -y pdftk

ADD container/containerbuddy/containerbuddy /sbin/containerbuddy

ENV APP_HOME /var/app
RUN mkdir -p $APP_HOME

ADD . $APP_HOME
WORKDIR $APP_HOME

RUN touch ./.env
RUN npm install
RUN npm -g install webpack
RUN webpack -p --config webpack.config.prod.js

CMD ["./bin/www"]