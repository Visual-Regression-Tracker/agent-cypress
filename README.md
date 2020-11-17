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
  addVrtStartCommand,
  addVrtStopCommand,
} from "@visual-regression-tracker/agent-cypress/dist/commands";

addVrtStartCommand();
addVrtStopCommand();
addVrtTrackCommand();
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

### Set environment variables

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

## Usage

### Setup

```js
cy.vrtStart();
```

### Assert

All `options` from `screenshot` command are also supported [more details](https://docs.cypress.io/api/commands/screenshot.html#Arguments)

```js
cy.vrtTrack("Whole page with default params");

cy.get("#navbar").vrtTrack("Separate element with default params");

cy.vrtTrack("Whole page with additional options", {
  os: "MacOS",
  device: "Cloud agent",
  diffTollerancePercent: 1,
});
```

Viewport is taken from `Cypress.config()`

Browser is taken from `Cypress.browser.name`

### Teadown

```js
cy.vrtStop();
```

## Examples

https://github.com/Visual-Regression-Tracker/examples-js
