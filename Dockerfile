FROM navikt/node-express:18
USER root
RUN apk --no-cach add curl
RUN apk add --update nodejs
RUN apk add --update npm
USER apprunner

COPY --chown=apprunner:apprunner ./ /var/server/

ARG base_path
ENV BASE_PATH=$base_path

ARG NPM_TOKEN
RUN npm config set "//npm.pkg.github.com/:_authToken" $NPM_TOKEN

RUN yarn --prefer-offline --frozen-lockfile
RUN yarn add less less-loader
RUN yarn build
RUN rm -f .npmrc

EXPOSE 9000
CMD ["yarn", "start"]