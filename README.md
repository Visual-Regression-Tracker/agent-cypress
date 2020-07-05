# Native integration for [Cypress](https://www.cypress.io/) with [Visual Regression Tracker](https://github.com/Visual-Regression-Tracker/Visual-Regression-Tracker)

## Installation
### Add package
`npm install @visual-regression-tracker/agent-cypress`

### Add command 
`<rootDir>/cypress/support/commands.js`
```js
import { addTrackCommand } from '@visual-regression-tracker/agent-cypress/dist/commands'

addTrackCommand()
```

### Add plugin 
`<rootDir>/cypress/plugins/index.js`
```js
const {
  addVisualRegressionTrackerPlugin
} = require('@visual-regression-tracker/agent-cypress/dist/plugin')

module.exports = (on, config) => {
  addVisualRegressionTrackerPlugin(on, config)
}
```
### Set environment variables
`<rootDir>/cypress.json`
```json
{
    "env": {
        "vrt_config": {
            // Fill with your data
            "apiUrl": "http://localhost:4200",

            // Fill with your data
            "branchName": "develop",

            // Fill with your data
            "projectId": "8cf7eba6-1378-449b-99c6-2e6b9e284e44",

            // Fill with your data
            "apiKey": "F3GCS56KVA4168HAN53YN31ASSVG"
        }
    }
}
```

## Usage
All `options` from `screenshot` command are also supported [more details](https://docs.cypress.io/api/commands/screenshot.html#Arguments)
_Default `diffTollerancePercent` is `1`_

_Viewport is taken from `Cypress.config()`_

_Browser is taken from `Cypress.browser.name`_
```js
cy.track('Whole page with default params')

cy.get('#navbar').track('Separate element with default params')

cy.track("Whole page with additional options", {
    os: "MacOS",
    device: "Cloud agent",
    diffTollerancePercent: 0,
})
```
