FROM cgr.dev/chainguard/node:18

WORKDIR /var/server

COPY ./ .
ARG NPM_TOKEN
RUN npm config set "//npm.pkg.github.com/:_authToken" $NPM_TOKEN

RUN yarn --prefer-offline --frozen-lockfile
RUN yarn build
RUN rm -f .npmrc

EXPOSE 9000
CMD ["yarn", "start"]
