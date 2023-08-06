/* global Cypress, cy */

import {
  bufferDtoToFormData,
  multipartDtoToFormData,
  TestRunResponse,
  TestStatus,
} from "@visual-regression-tracker/sdk-js";

// Task names
export const VRT_TASK_START = "VRT_START";
export const VRT_TASK_STOP = "VRT_STOP";
export const VRT_TASK_TRACK = "VRT_TRACK";

// Command names
export const VRT_COMMAND_START = "vrtStart";
export const VRT_COMMAND_STOP = "vrtStop";
export const VRT_COMMAND_TRACK = "vrtTrack";
export const VRT_COMMAND_TRACK_BUFFER = "vrtTrackBuffer";
export const VRT_COMMAND_TRACK_BASE64 = "vrtTrackBase64";

// Private method name in sdk-js, FIXME: public?
export const VRT_IS_STARTED = "isStarted";

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

export const trackImage = (
  subject: any,
  name: string,
  options: any
): Cypress.Chainable<TestRunResponse> => {
  let imagePath: string;
  let pixelRatio: number;
  const target = subject ? cy.wrap(subject) : cy;

  // cy.screenshot() return Type is always Chainable<null>
  // https://github.com/cypress-io/cypress/issues/21277
  return target
    .screenshot(name, {
      ...options,
      onAfterScreenshot: ($el, props) => {
        imagePath = props.path;
        pixelRatio = props.pixelRatio;
        return options?.onAfterScreenshot;
      },
    }) // @ts-ignore
    .then(() => log(`tracking ${name}`))
    .then(() =>
      cy.task(
        VRT_TASK_TRACK,
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
    VRT_TASK_TRACK,
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
    VRT_TASK_TRACK,
    {
      ...toTestRunDto({ name, options }),
      imageBase64,
    },
    { log: false }
  );
};
