/* global Cypress, cy */

import { TestRunResponse, TestStatus } from "@visual-regression-tracker/sdk-js";

export const addVrtStartCommand = () => {
  Cypress.Commands.add(
    "vrtStart",
    {
      prevSubject: ["optional"],
    },
    () => {
      cy.task("VRT_START", {}, { log: false })
        .then((err) => {
          if (err) {
            throw new Error(err as string);
          }
        })
        .then(() => log("Started"));
    }
  );
};

export const addVrtStopCommand = () => {
  Cypress.Commands.add(
    "vrtStop",
    {
      prevSubject: ["optional"],
    },
    () => {
      cy.task("VRT_STOP", {}, { log: false })
        .then((err) => {
          if (err) {
            throw new Error(err as string);
          }
        })
        .then(() => log("Stopped"));
    }
  );
};

export const addVrtTrackCommand = () =>
  Cypress.Commands.add(
    "vrtTrack",
    {
      prevSubject: ["optional", "element", "window", "document"],
    },
    (subject, name, options) => {
      trackWithRetry(
        () => trackImage(subject, name, options),
        (result) => shouldStopRetry(result as TestRunResponse),
        options
      );
    }
  );

const trackWithRetry = (
  trackFn: () => Cypress.Chainable<unknown>,
  shouldStopFn: (result: any) => boolean,
  options: {
    retryLimit: number;
  } = {
    retryLimit: 2,
  }
) => {
  trackFn().then((result) => {
    if (shouldStopFn(result)) {
      return;
    }

    if (options.retryLimit <= 0) {
      cy.task("PROCESS_RESULT", result, { log: false });
      return;
    }

    log(`Diff found... Remaining retry attempts **${options.retryLimit}**`);
    trackWithRetry(trackFn, shouldStopFn, {
      retryLimit: options.retryLimit - 1,
    });
  });
};

const shouldStopRetry = (result: TestRunResponse) =>
  result?.status === TestStatus.ok ||
  // no need to retry if no baseline
  result?.status === TestStatus.new;

const trackImage = (
  subject: any,
  name: string,
  options: any
): Cypress.Chainable<unknown> => {
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
        "TRACK_IMAGE",
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

const log = (message: string) =>
  Cypress.log({
    name: "Visual Regression Tracker",
    displayName: "VRT",
    message,
  });
