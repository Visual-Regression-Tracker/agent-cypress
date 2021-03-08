/* global Cypress, cy */

import { TestRunResponse, TestStatus } from "@visual-regression-tracker/sdk-js";

export const log = (message: string) =>
  Cypress.log({
    name: "Visual Regression Tracker",
    displayName: "VRT",
    message,
  });

export const trackWithRetry = (
  trackFn: () => Cypress.Chainable<TestRunResponse>,
  shouldStopFn: (result: TestRunResponse) => boolean,
  onStopFn: (result: TestRunResponse) => Cypress.Chainable<unknown>,
  retryLimit: number = 2
): Cypress.Chainable<unknown> => {
  return trackFn().then((result) => {
    if (retryLimit <= 0 || shouldStopFn(result)) {
      onStopFn(result);
      return;
    }

    log(`Diff found... Remaining retry attempts **${retryLimit}**`);
    return trackWithRetry(trackFn, shouldStopFn, onStopFn, retryLimit - 1);
  });
};

export const checkResult = (result: TestRunResponse) =>
  cy.task("VRT_PROCESS_ERROR_RESULT", result, { log: false });

export const shouldStopRetry = (result: TestRunResponse) =>
  result?.status === TestStatus.ok ||
  // no need to retry if no baseline
  result?.status === TestStatus.new;

export const trackImage = (
  subject: any,
  name: string,
  options: any
): Cypress.Chainable<TestRunResponse> => {
  let imagePath: string;
  let pixelRatio: number;
  const target = subject ? cy.wrap(subject) : cy;

  return target
    .screenshot(name, {
      ...options,
      onAfterScreenshot: (el, props) => {
        imagePath = props.path;
        pixelRatio = props.pixelRatio;
        return options?.onAfterScreenshot;
      },
    })
    .then(() => log(`tracking ${name}`))
    .then(() => cy.task("ENCODE_IMAGE", { imagePath }, { log: false }))
    .then((imageBase64) =>
      cy.task(
        "VRT_TRACK_IMAGE",
        {
          name,
          imageBase64,
          browser: Cypress.browser.name,
          pixelRatio,
          os: options?.os,
          device: options?.device,
          diffTollerancePercent: options?.diffTollerancePercent,
          ignoreAreas: options?.ignoreAreas,
        },
        { log: false }
      )
    );
};
