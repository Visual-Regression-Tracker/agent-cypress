import { defineConfig } from 'cypress';
import { addVisualRegressionTrackerPlugin } from "./lib/plugin";

/**
 * @see https://docs.cypress.io/guides/references/configuration
 */
export default defineConfig({
    e2e: {
        baseUrl: "https://example.cypress.io",

        setupNodeEvents(on, config) {
            // `on` is used to hook into various events Cypress emits
            // `config` is the resolved Cypress config
            addVisualRegressionTrackerPlugin(on, config);
        },
    },
    video: false,
    screenshotOnRunFailure: false,
    retries: 0,
    env: {
        "visualRegressionTracker": {
          "apiUrl": "http://localhost:4200",
          "apiKey": "5H90NFWM6BMWWDMWKG8T11DWW22Y",
          "project": "fcf9ab05-4bed-40d6-a033-c178948c9897",
          "branchName": "master",
          "enableSoftAssert": false
        }
    }
});