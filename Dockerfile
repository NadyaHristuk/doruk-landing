FROM ${AWS_ACCOUNT_ID}.dkr.ecr.eu-central-1.amazonaws.com/base-private-${ENVIRONMENT}-ecr:base-nginx-1

RUN apk update
RUN apk upgrade
# Clean APK cache
RUN rm -rf /var/cache/apk/*

LABEL "io.doruk.image"="project"

COPY default.conf /etc/nginx/conf.d/default.conf

COPY dist /source

EXPOSE 80