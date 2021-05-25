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
  cy.task("VRT_PROCESS_ERROR_RESULT", result, { log: false }).then(handleError);

export const shouldStopRetry = (result: TestRunResponse) =>
  result?.status !== TestStatus.unresolved;

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
    .then(() =>
      cy.task(
        "VRT_TRACK_IMAGE_MULTIPART",
        {
          ...toTestRunDto({ name, pixelRatio, options }),
          imagePath,
        },
        { log: false }
      )
    );
};

export const handleError = (err: unknown) => {
  if (err) {
    throw new Error(err as string);
  }
};

export const toTestRunDto = ({
  name,
  pixelRatio,
  options,
}: {
  name: string;
  pixelRatio: number;
  options: any;
}) => ({
  name,
  browser: Cypress.browser.name,
  viewport:
    options?.viewport ??
    `${Cypress.config("viewportWidth") * pixelRatio}x${
      Cypress.config("viewportHeight") * pixelRatio
    }`,
  os: options?.os,
  device: options?.device,
  diffTollerancePercent: options?.diffTollerancePercent,
  ignoreAreas: options?.ignoreAreas,
});
