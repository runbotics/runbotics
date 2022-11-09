FROM node:14-alpine as builder

WORKDIR /usr/src/app

COPY --chown=node:node . .

USER node

RUN node common/scripts/install-run-rush.js install -t runbotics-orchestrator-ui

WORKDIR /usr/src/app/runbotics-orchestrator-ui

RUN node ../common/scripts/install-run-rushx.js build
RUN mkdir -p ../common/deploy/runbotics-orchestrator-ui;

RUN node ../common/scripts/install-run-rush.js deploy --scenario runbotics-orchestrator-ui --overwrite --target-folder ../common/deploy/runbotics-orchestrator-ui;




FROM node:14-alpine AS runner

ENV NODE_ENV production

WORKDIR /usr/src/app/runbotics-orchestrator-ui

COPY --from=builder /usr/src/app/common/deploy/runbotics-orchestrator-ui .
COPY --from=builder /usr/src/app/common/scripts .

RUN node create-links.js create

WORKDIR /usr/src/app/runbotics-orchestrator-ui/runbotics-orchestrator-ui

EXPOSE 3000

CMD ["node_modules/next/dist/bin/next", "start"]