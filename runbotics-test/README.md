# Playwright testing suite

Requires application being deployed at some URL. Right now it uses https://runbotics-dev.clouddc.eu/ . This can be changed in configuration file.

## Setup

1. Run `npm i`
2. Run `npm run setup` to install web browsers used for testing.
3. To run test suite run `npm run test`
4. Use `npm run show-report` for showing existing report.
5. To run UI for developing and debugging tests run `npm run test:ui`

## Reports

Reports are stored in `./test-results`

## Managing secrets

Secrets should be stored in `.auth` directory, which is not part of the codebase. Right now the test suite expects single file called `user.json` to be there and be formatted like:

```json
{
    "login": "[HERE INSERT USER LOGIN]",
    "password": "[HERE INSERT USER PASSWORD]"
}
```

## tsconfig.json

tsconfig.json here is added, so that linting works fine in code editor.

Other files like `.prettierrc` or `.eslintrc` may be included here as well.

## CI/CD deployment

Right now this test suite expect application to be already deployed somewhere.

Playwright supports running web server as a part of test suite.

See this example configuration:

```javascript
/* Run your local dev server before starting the tests */
{
    webServer: {
        command: 'npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        stdout: 'ignore',
        stderr: 'pipe',
    },
}
```

For more info see https://playwright.dev/docs/test-webserver