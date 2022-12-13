/* global Cypress, cy */

import {
  bufferDtoToFormData,
  multipartDtoToFormData,
  TestRunResponse,
  TestStatus,
} from "@visual-regression-tracker/sdk-js";

export const log = (message: string) =>
  Cypress.log({
    name: "Visual Regression Tracker",
    displayName: "VRT",
    message,
  });

export const handleError = (err: unknown) => {
  if (err) {
    throw new Error(err as string);
  }
};

export const toTestRunDto = ({
  name,
  pixelRatio = 1,
  options,
}: {
  name: string;
  pixelRatio?: number;
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
  customTags: options?.customTags,
  diffTollerancePercent: options?.diffTollerancePercent,
  ignoreAreas: options?.ignoreAreas,
  // next two properties actually do not belong to TestRunDto and ideally should be removed from this object
  keepScreenshot: options?.keepScreenshot,
  retryLimit: options?.retryLimit,
});

export const checkResult = (
  result: TestRunResponse | string,
  errorCallback?: (err: string) => boolean
) => {
  if (typeof result === "string") {
    // . this is an error message
    if (errorCallback) {
      if (errorCallback(result as string)) {
        return;
      }
    }
    handleError(result);
  }
};

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
        "VRT_TRACK",
        {
          ...toTestRunDto({ name, pixelRatio, options }),
          imagePath,
        },
        { log: false }
      )
    );
};

export const trackBuffer = (
  name: string,
  imageBuffer: Buffer,
  options: any
): Cypress.Chainable<TestRunResponse> => {
  log(`tracking ${name}`);
  return cy.task(
    "VRT_TRACK",
    {
      ...toTestRunDto({ name, options }),
      imageBuffer,
    },
    { log: false }
  );
};

export const trackBase64 = (
  name: string,
  imageBase64: string,
  options: any
): Cypress.Chainable<TestRunResponse> => {
  log(`tracking ${name}`);
  return cy.task(
    "VRT_TRACK",
    {
      ...toTestRunDto({ name, options }),
      imageBase64,
    },
    { log: false }
  );
};
