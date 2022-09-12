/* global Cypress, cy */
import {
  log,
  shouldStopRetry,
  checkResult,
  trackImage,
  trackWithRetry,
  handleError,
  trackBase64,
  trackBuffer,
} from "./utils";

export const addVrtStartCommand = () => {
  Cypress.Commands.add(
    "vrtStart",
    {
      prevSubject: ["optional"],
    },
    () => {
      cy.task("VRT_START", {}, { log: false })
        .then(handleError)
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
        .then(handleError)
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
    (subject, name, options, errorCallback) => {
      trackWithRetry(
        () => trackImage(subject, name, options),
        (result) => shouldStopRetry(result),
        (result) => checkResult(result, errorCallback),
        options?.retryLimit
      );
    }
  );

export const addVrtTrackBufferCommand = () =>
  Cypress.Commands.add(
    "vrtTrackBuffer",
    {
      prevSubject: false,
    },
    (name, imageBuffer, options) => {
      trackBuffer(name, imageBuffer, options).then((result) =>
        checkResult(result)
      );
    }
  );

export const addVrtTrackBase64Command = () =>
  Cypress.Commands.add(
    "vrtTrackBase64",
    {
      prevSubject: false,
    },
    (name, imageBase64, options) => {
      trackBase64(name, imageBase64, options).then((result) =>
        checkResult(result)
      );
    }
  );
