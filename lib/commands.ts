/* global Cypress, cy */
import {
  log,
  shouldStopRetry,
  checkResult,
  trackImage,
  trackWithRetry,
} from "./utils";

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
        (result) => shouldStopRetry(result),
        (result) => checkResult(result),
        options.retryLimit
      );
    }
  );
