FROM node:18-alpine

WORKDIR /usr/src/app

COPY --chown=node:node . .

USER node

WORKDIR /usr/src/app/runbotics-lp

EXPOSE 3001

CMD node ../create-links.js create && node_modules/next/dist/bin/next start
