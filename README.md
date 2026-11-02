# Cypress agent for [Visual Regression Tracker](https://github.com/Visual-Regression-Tracker/Visual-Regression-Tracker)

[![npm](https://img.shields.io/npm/v/@visual-regression-tracker/agent-cypress)](https://www.npmjs.com/package/@visual-regression-tracker/agent-cypress)

Adds `cy.vrtStart()`, `cy.vrtTrack()` and `cy.vrtStop()` to [Cypress](https://www.cypress.io) tests. The agent is built on [sdk-js](https://github.com/Visual-Regression-Tracker/sdk-js).

## Requirements

- Cypress 12.17.1 or later
- Node.js 18 or later
- Visual Regression Tracker server 5.0.8 or later; 6 is recommended

## Install

```sh
npm install --save-dev @visual-regression-tracker/agent-cypress
```

Register the plugin in `cypress.config.js` (under `component` for component tests):

```js
import { defineConfig } from "cypress";
import { addVisualRegressionTrackerPlugin } from "@visual-regression-tracker/agent-cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      addVisualRegressionTrackerPlugin(on, config);
    },
  },
});
```

Add the commands in `cypress/support/e2e.js` (or `component.js`):

```js
import { addVrtCommands } from "@visual-regression-tracker/agent-cypress";

addVrtCommands();
```

To add only some of them, use `addVrtStartCommand`, `addVrtStopCommand`, `addVrtTrackCommand`, `addVrtTrackBufferCommand` and `addVrtTrackBase64Command`.

## Configuration

| Option | Environment variable | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `apiUrl` | `VRT_APIURL` | yes | | URL of the server API, e.g. `http://localhost:4200` |
| `apiKey` | `VRT_APIKEY` | yes | | API key of a user with access to the project |
| `project` | `VRT_PROJECT` | yes | | Project name or ID |
| `branchName` | `VRT_BRANCHNAME` | yes | | Current git branch |
| `sourceBranch` | `VRT_SOURCEBRANCH` | no | project's main branch | Branch to take baselines from while `branchName` has none of its own |
| `ciBuildId` | `VRT_CIBUILDID` | no | | ID of one CI build; machines with the same ID share a build |
| `enableSoftAssert` | `VRT_ENABLESOFTASSERT` | no | `false` | Log failed comparisons instead of failing the test |

Set the options under `env.visualRegressionTracker` in the Cypress config:

```js
export default defineConfig({
  env: {
    visualRegressionTracker: {
      apiUrl: "http://localhost:4200",
      apiKey: "tXZVHX0EA4YQM1MGDD",
      project: "Default project",
      branchName: "develop",
    },
  },
});
```

If `visualRegressionTracker` is not set, the options are read from `vrt.json` in the working directory, with the same keys:

```json
{
  "apiUrl": "http://localhost:4200",
  "apiKey": "tXZVHX0EA4YQM1MGDD",
  "project": "Default project",
  "branchName": "develop",
  "sourceBranch": "release",
  "ciBuildId": "commit_sha",
  "enableSoftAssert": false
}
```

Environment variables override `vrt.json` key by key. When `visualRegressionTracker` is set, only `VRT_SOURCEBRANCH` is read from the environment.

`baselineBranchName` (`VRT_BASELINEBRANCHNAME`) is a deprecated alias of `sourceBranch`. It still works and logs a warning once.

## Usage

```js
before(() => cy.vrtStart());
after(() => cy.vrtStop());

it("home page", () => {
  cy.visit("/");

  cy.vrtTrack("Home page");

  cy.get("#navbar").vrtTrack("Navbar", {
    os: "linux",
    device: "desktop",
    customTags: "smoke,dark",
    diffTollerancePercent: 1,
    ignoreAreas: [{ x: 1, y: 2, width: 100, height: 200 }],
    retryLimit: 2,
    keepScreenshot: false,
  });
});
```

`cy.vrtTrack(name, options, errorCallback)` takes a screenshot of the page, or of the element it is chained on, and uploads it as multipart. Every option is optional:

| Option | Description |
| --- | --- |
| `os`, `device`, `customTags` | Tell baselines of the same name apart |
| `viewport` | Defaults to `viewportWidth`x`viewportHeight` times the pixel ratio |
| `diffTollerancePercent` | Allowed difference, in percent of all pixels (the spelling is the API's) |
| `ignoreAreas` | `[{ x, y, width, height }]` in pixels, left out of the comparison |
| `retryLimit` | Retries while the result is `unresolved`, default 2 |
| `keepScreenshot` | Keep the local screenshot file, default `false` |
| any [`cy.screenshot()` option](https://docs.cypress.io/api/commands/screenshot#Arguments) | Passed to the screenshot |

The browser is taken from `Cypress.browser.name`.

`cy.vrtTrackBuffer(name, buffer, options)` and `cy.vrtTrackBase64(name, base64, options)` track an image you already have.

## Results and statuses

| Status | Outcome |
| --- | --- |
| `new` | No baseline yet: fails the test, or logs with `enableSoftAssert` |
| `unresolved` | Differs from the baseline: fails the test, or logs with `enableSoftAssert` |
| `ok`, `approved`, `autoApproved` | Passes |
| `failed` | A reviewer rejected it: passes with a warning |
| anything else | Passes with a warning |

Logs and warnings appear in the terminal that runs Cypress, not in the browser.

## Errors

A failed comparison or request fails the test with the server's message. Use `errorCallback` to handle it for one screenshot:

```js
cy.vrtTrack("Home page", {}, (err) => {
  cy.log(err);
  return true; // true: do not fail the test
});
```

Request errors name the HTTP status and add a hint for common causes, such as a wrong `apiKey` (401) or an image over the server's limits (413, 422). See [sdk-js](https://github.com/Visual-Regression-Tracker/sdk-js#errors).

## Examples

[examples-js](https://github.com/Visual-Regression-Tracker/examples-js)

## Releasing

Every push to `master` runs [semantic-release](https://semantic-release.gitbook.io). It reads the [Conventional Commits](https://www.conventionalcommits.org) since the last `v*` tag:

| Commit | Release |
| --- | --- |
| `fix:` | patch |
| `feat:` | minor |
| `feat!:` or a `BREAKING CHANGE:` footer | major |
| `chore:`, `ci:`, `docs:`, `test:` | none |

It then publishes to npm through trusted publishing with provenance, tags `vX.Y.Z`, and writes the GitHub release.
The `version` field in `package.json` is a placeholder. The released version lives in the tags and on npm.

## License

[Apache-2.0](LICENSE)
