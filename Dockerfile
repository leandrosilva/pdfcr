FROM zenika/alpine-chrome AS base

FROM base AS install
WORKDIR /usr/src/app
COPY package.json .
RUN npm install

COPY index.js .
EXPOSE 19222

ENTRYPOINT [ "node", "index.js" ]