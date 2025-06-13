# Proxy for running UI

This package provides proxy for testing, which lets user run rb-ui locally, while using other services from the dev instance.

## Running it

1. `npm i`
2. `npm run start`

Note that in order for it to work, some chnages must be made in UI configuration.

The DEV_PROXY_ENABLED env var must be set to `1` in order for it to work.