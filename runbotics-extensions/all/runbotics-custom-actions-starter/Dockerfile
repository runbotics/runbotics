FROM node:14-slim as builder

ENV NODE_ENV build


USER node
WORKDIR /home/node

COPY . /home/node

RUN yarn install --frozen-lockfile \
    && yarn run build


# ---


FROM node:14-slim as production

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/yarn.lock /home/node/
COPY --from=builder /home/node/dist/ /home/node/dist/

RUN yarn install --production --frozen-lockfile
RUN yarn cache clean
FROM busybox:latest

ARG EXTENSION_NAME


COPY --from=production /home/node/ /extension/$EXTENSION_NAME/

ENTRYPOINT echo "Installing extension $EXTENSION_NAME"; \
           ls -al /extension; \
           cp -rf /extension/. /runbotics-extensions/


