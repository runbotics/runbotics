FROM node:18-alpine

RUN apk add curl --no-cache

WORKDIR /usr/src/app

COPY --chown=node:node . .

USER node

WORKDIR /usr/src/app/runbotics-scheduler

EXPOSE 4000

CMD node ../create-links.js create && node dist/src/main

HEALTHCHECK --interval=30s --timeout=60s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:4000/api/scheduler/health || exit 1