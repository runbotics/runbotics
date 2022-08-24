FROM node:14-slim

WORKDIR /usr/src/app

COPY --chown=node:node . .

USER node

WORKDIR /usr/src/app/runbotics-scheduler

EXPOSE 4000

CMD node ../create-links.js create && node dist/main