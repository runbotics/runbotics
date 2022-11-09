FROM node:14-alpine

WORKDIR /usr/src/app

COPY --chown=node:node . .

USER node

WORKDIR /usr/src/app/runbotics-orchestrator-ui

EXPOSE 3000

# CMD node ../create-links.js create && node dist/main