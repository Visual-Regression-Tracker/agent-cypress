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
  keepScreenshot: options?.keepScreenshot,
});

export const trackWithRetry = (
  trackFn: () => Cypress.Chainable<TestRunResponse>,
  shouldStopFn: (result: TestRunResponse) => boolean,
  onStopFn: (result: TestRunResponse) => Cypress.Chainable<unknown>,
  retryLimit: number = 2
): unknown => {
  return trackFn().then((result) => {
    if (retryLimit <= 0 || shouldStopFn(result)) {
      onStopFn(result);
      return;
    }

    log(`Diff found... Remaining retry attempts **${retryLimit}**`);
    return trackWithRetry(trackFn, shouldStopFn, onStopFn, retryLimit - 1);
  });
};

export const checkResult = (
  result: TestRunResponse,
  errorCallback?: (err:string) => boolean
) => cy.task("VRT_PROCESS_ERROR_RESULT", result, { log: false }).then((err) => {
  if(err && errorCallback){
    if(errorCallback(err as string)){
      return;
    }
  }
  handleError(err);
});

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

export const trackBuffer = (
  name: string,
  imageBuffer: Buffer,
  options: any
): Cypress.Chainable<TestRunResponse> => {
  log(`tracking ${name}`);
  return cy.task(
    "VRT_TRACK_BUFFER_MULTIPART",
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
    "VRT_TRACK_IMAGE_BASE64",
    {
      ...toTestRunDto({ name, options }),
      imageBase64,
    },
    { log: false }
  );
};
