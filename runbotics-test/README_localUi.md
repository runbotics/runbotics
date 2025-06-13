# Running tests with local ui

1. Setup of `runbotics-dev-proxy` is needed via [its README.md](./runbotics-dev-proxy/README.md); It can be started in this step.
2. Env called `DEV_PROXY_ENABLED` must be set to `1`. This can be done using:  
    - `export DEV_PROXY_ENABLED=1` in bash
    - `DEV_PROXY_ENABLED=1` must be set in `runbotics/runbotics-orchestrator-ui/.env` file 
    - `DEV_PROXY_ENABLED=1 rb ui` command can be used instead of `rb ui` in the next step.
3. Start UI with `rb ui`
4. Change in [playwright.config.ts](./playwright.config.ts) baseURL parameter to `http://localhost:3000`
5. Run `npm run test:ui`

## Notes

1. Next.js compiles pages by on-demand basics, so first run of tests may need greater timeouts.
2. In fact, increasing `timeout: ` option is advised for running this kind of setup.

## Summary

There should be three services running simultaneously:
1. runbotics-dev-proxy via `npm run start`
2. runbotics-orchestrator-ui via `DEV_PROXY_ENABLED=1 rb ui`
3. playwright test suite via `npm run test:ui` or `npm run test`