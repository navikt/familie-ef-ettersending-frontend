FROM navikt/node-express:14-alpine
USER root
RUN apk --no-cach add curl
RUN apk add --update nodejs
RUN apk add --update npm
USER apprunner

COPY --chown=apprunner:apprunner ./ /var/server/

ARG base_path
ENV BASE_PATH=$base_path

RUN npm install
RUN npm install less less-loader
RUN npm run build

EXPOSE 9000
CMD ["npm", "start"]