FROM gcr.io/distroless/nodejs24-debian12

WORKDIR /var/server

COPY assets ./assets
COPY dist ./dist
COPY build ./build
COPY node_modules ./node_modules
COPY package.json .

ENV NODE_ENV=production
EXPOSE 9000
CMD ["--es-module-specifier-resolution=node", "build/backend/server.js"]

