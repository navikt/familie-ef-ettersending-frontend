FROM cgr.dev/chainguard/node:18

WORKDIR /var/server

COPY assets ./assets
COPY dist ./dist
COPY build ./build
COPY node_modules ./node_modules
COPY package.json .

EXPOSE 9000
CMD ["npm", "run", "start"]
