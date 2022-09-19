# Native integration for [Cypress](https://www.cypress.io/) with [Visual Regression Tracker](https://github.com/Visual-Regression-Tracker/Visual-Regression-Tracker)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4ebb8d37b8f943548e992a7d063ac998)](https://www.codacy.com/gh/Visual-Regression-Tracker/agent-cypress?utm_source=github.com&utm_medium=referral&utm_content=Visual-Regression-Tracker/agent-cypress&utm_campaign=Badge_Grade)

Npm: https://www.npmjs.com/package/@visual-regression-tracker/agent-cypress

## Installation

### Add package

`npm install @visual-regression-tracker/agent-cypress`

### Add command

`<rootDir>/cypress/support/commands.js`

```js
import {
  addVrtTrackCommand,
  addVrtTrackBufferCommand,
  addVrtTrackBase64Command,
} from "@visual-regression-tracker/agent-cypress/dist/commands";

addVrtTrackCommand();
addVrtTrackBufferCommand();
addVrtTrackBase64Command();
```

### Add plugin

`<rootDir>/cypress/plugins/index.js`

```js
const {
  addVisualRegressionTrackerPlugin,
} = require("@visual-regression-tracker/agent-cypress/dist/plugin");

module.exports = (on, config) => {
  addVisualRegressionTrackerPlugin(on, config);
};
```

### Configuration

#### Update cypress config

`<rootDir>/cypress.json`

```js
{
  "env": {
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

      // Log errors instead of throwing exceptions
      // Optional - default false
      "enableSoftAssert": true,

      // Unique ID related to one CI build
      // Optional - default null
      "ciBuildId": "SOME_UNIQUE_ID",
    }
  }
}
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
VRT_ENABLESOFTASSERT=true
```

## Usage

### Setup

vrtStart and vrtStop are now handled automatically when the testrun starts / ends. No need to call the functions in before and after blocks anymore.

### Assert

```js
cy.vrtTrack("Whole page with default params");

cy.get("#navbar").vrtTrack("Separate element with default params");

cy.vrtTrack("Whole page with additional options", {
  viewport: "1920x1080",
  os: "MacOS",
  device: "Cloud agent",
  customTags: "Cloud, DarkTheme, Auth",
  diffTollerancePercent: 1,
  ignoreAreas: [{ x: 1, y: 2, width: 100, height: 200 }],
  retryLimit: 2,
  keepScreenshot: false, // Keep screenshot local copy, false by default
}, (err)=>{
  console.log('Screenshot has diff with baseline', err);
  return true; // Skip failing test
});
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
