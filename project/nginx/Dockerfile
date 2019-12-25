FROM nginx:1.15.12-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# copy angular project
COPY ./angular-src/ /usr/src/app/angular-src


