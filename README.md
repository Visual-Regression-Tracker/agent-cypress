# Native integration for [Cypress](https://www.cypress.io/) with [Visual Regression Tracker](https://github.com/Visual-Regression-Tracker/Visual-Regression-Tracker)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4ebb8d37b8f943548e992a7d063ac998)](https://www.codacy.com/gh/Visual-Regression-Tracker/agent-cypress?utm_source=github.com&utm_medium=referral&utm_content=Visual-Regression-Tracker/agent-cypress&utm_campaign=Badge_Grade)

Npm: https://www.npmjs.com/package/@visual-regression-tracker/agent-cypress

## Installation

Please note that the minimum supported Cypress version is [`12.17.1`, released in 10th July 2023](https://docs.cypress.io/guides/references/changelog#12-17-1).

### Add package

`npm install @visual-regression-tracker/agent-cypress`

### Add commands

`<rootDir>/cypress/support/e2e.js` or `<rootDir>/cypress/support/component.js`

All available commands:

```js
import {
  addVrtCommands,
} from "@visual-regression-tracker/agent-cypress";

addVrtCommands();
```

or one by one:

```js
import {
  addVrtTrackCommand,
  addVrtStartCommand,
  addVrtStopCommand,
  addVrtTrackBufferCommand,
  addVrtTrackBase64Command,
} from "@visual-regression-tracker/agent-cypress";

addVrtStartCommand();
addVrtStopCommand();
addVrtTrackCommand();
addVrtTrackBufferCommand();
addVrtTrackBase64Command();
```

### Add plugin

`<rootDir>/cypress.config.js`

```js
import { defineConfig } from 'cypress';
import { addVisualRegressionTrackerPlugin } from "@visual-regression-tracker/agent-cypress";

export default defineConfig({
  // e2e or component, depending of testing style
  e2e: {
    setupNodeEvents(on, config) {
      addVisualRegressionTrackerPlugin(on, config);
    }
  }
});
```

### Configuration

#### Update Cypress config

`<rootDir>/cypress.config.js`

```js
export default defineConfig({

  env: {
    "visualRegressionTracker": {
      // URL where backend is running
      // Required
      "apiUrl": "http://localhost:4200",

      // Project name or ID
      // Required
      "project": "Default project",

      // User apiKey
      // Required
      "apiKey": "tXZVHX0EA4YQM1MGDD",

      // Current git branch
      // Required
      "branchName": "develop",

      // Branch to take baselines from instead of the project's main branch
      // Optional - when not set, main branch from project settings is used
      // Also read from VRT_SOURCEBRANCH when not set here
      "sourceBranch": "release",

      // Log errors instead of throwing exceptions
      // Optional - default false
      "enableSoftAssert": true,

      // Unique ID related to one CI build
      // Optional - default null
      "ciBuildId": "SOME_UNIQUE_ID",
    }
  }
});
```

#### Or, as JSON config file `vrt.json`

_Used only if not explicit config provided_
_Is overriden if ENV variables are present_

```json
{
  "apiUrl": "http://localhost:4200",
  "project": "Default project",
  "apiKey": "tXZVHX0EA4YQM1MGDD",
  "ciBuildId": "commit_sha",
  "branchName": "develop",
  "sourceBranch": "release",
  "enableSoftAssert": false
}
```

#### Or, as environment variables

_Used only if not explicit config provided_

```
VRT_APIURL="http://localhost:4200"
VRT_PROJECT="Default project"
VRT_APIKEY="tXZVHX0EA4YQM1MGDD"
VRT_CIBUILDID="commit_sha"
VRT_BRANCHNAME="develop"
VRT_SOURCEBRANCH="release"
VRT_ENABLESOFTASSERT=true
```

`sourceBranch` replaces `baselineBranchName` (`VRT_BASELINEBRANCHNAME`), which
the server never read. The old name still works as an alias and logs a
deprecation warning; like the other `VRT_*` variables, `VRT_BASELINEBRANCHNAME`
is read only when `visualRegressionTracker` is not set in the Cypress config.

## Usage

### Setup

```js
cy.vrtStart();
```

### Assert

```js
cy.vrtTrack("Whole page with default params");

cy.get("#navbar").vrtTrack("Separate element with default params");

cy.vrtTrack(
  "Whole page with additional options",
  {
    viewport: "1920x1080",
    os: "MacOS",
    device: "Cloud agent",
    customTags: "Cloud, DarkTheme, Auth",
    diffTollerancePercent: 1,
    ignoreAreas: [{ x: 1, y: 2, width: 100, height: 200 }],
    retryLimit: 2,
    keepScreenshot: false, // Keep screenshot local copy, false by default
  },
  (err) => {
    console.log("Screenshot has diff with baseline", err);
    return true; // Skip failing test
  }
);
```

##### options (optional)

Allows to set options for taking screenshot. All `options` from `screenshot` command are also supported [more details](https://docs.cypress.io/api/commands/screenshot.html#Arguments)

Viewport is taken from `Cypress.config()`, if option is not set

Browser is taken from `Cypress.browser.name`

##### errorCallbak (optional)

Allows you to define a callback that receives the error for custom side-effects.

Also allows to override assertion policy. When callback returns `true` this acts similar to `enableSoftAssertions` option in config, but allows to enable soft assertion only for one specific screenshot.

### Teadown

```js
cy.vrtStop();
```

## Examples

https://github.com/Visual-Regression-Tracker/examples-js
