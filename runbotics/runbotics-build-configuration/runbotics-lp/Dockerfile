FROM node:18-alpine

RUN apk add --no-cache curl

WORKDIR /usr/src/app

COPY --chown=node:node . .

USER node

WORKDIR /usr/src/app/runbotics-lp

EXPOSE 3001

CMD node ../create-links.js create && node_modules/next/dist/bin/next start -p 3001

HEALTHCHECK --interval=30s --timeout=60s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3001/api/lp-health || exit 1
