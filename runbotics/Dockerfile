FROM node:18-alpine as builder

WORKDIR /usr/src/app

COPY --chown=node:node . .

USER node

RUN rm -rf runbotics-orchestrator-ui/.next

ENV rush='node common/scripts/install-run-rush.js'
ENV deploy_target='common/deploy/runbotics-orchestrator-ui'

RUN $rush install -t runbotics-orchestrator-ui

RUN $rush rebuild -t runbotics-orchestrator-ui

RUN mkdir -p $deploy_target

RUN $rush deploy \
    --overwrite \
    --scenario runbotics-orchestrator-ui \
    --target-folder $deploy_target



FROM node:18-alpine AS runner

RUN apk add --no-cache curl

ENV NODE_ENV production

WORKDIR /usr/src/app/runbotics-orchestrator-ui

COPY --from=builder /usr/src/app/common/deploy/runbotics-orchestrator-ui .
COPY --from=builder /usr/src/app/common/scripts .

RUN node create-links.js create

WORKDIR /usr/src/app/runbotics-orchestrator-ui/runbotics-orchestrator-ui

EXPOSE 3000

CMD ["node_modules/next/dist/bin/next", "start"]

HEALTHCHECK --interval=30s --timeout=60s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/api/ui-health || exit 1
