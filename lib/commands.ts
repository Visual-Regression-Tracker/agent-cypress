/* global Cypress, cy */
import {
  log,
  checkResult,
  trackImage,
  handleError,
  trackBase64,
  trackBuffer,
  VRT_TASK_START,
  VRT_TASK_STOP,
  VRT_COMMAND_START,
  VRT_COMMAND_STOP,
  VRT_COMMAND_TRACK,
  VRT_COMMAND_TRACK_BUFFER,
  VRT_COMMAND_TRACK_BASE64,
} from "./utils";

export const addVrtStartCommand = () => {
  Cypress.Commands.add(
    VRT_COMMAND_START,
    {
      // optional: may start a chain, or use an existing chain: (dual command)
      prevSubject: "optional",
    },
    () => {
      cy.task(VRT_TASK_START, {}, { log: false })
        .then(handleError)
        .then(() => log("Started"));
    }
  );
};

export const addVrtStopCommand = () => {
  Cypress.Commands.add(
    VRT_COMMAND_STOP,
    {
      // optional: may start a chain, or use an existing chain: (dual command)
      prevSubject: "optional",
    },
    () => {
      cy.task(VRT_TASK_STOP, {}, { log: false })
        .then(handleError)
        .then(() => log("Stopped"));
    }
  );
};

export const addVrtTrackCommand = () =>
  Cypress.Commands.add(
    VRT_COMMAND_TRACK,
    {
      // https://docs.cypress.io/api/cypress-api/custom-commands#Arguments
      prevSubject: ["optional", "element", "window", "document"],
    }, // @ts-ignore
    (subject, name, options, errorCallback) => {
      trackImage(subject, name, options).then((result: any) =>
        checkResult(result, errorCallback)
      );
    }
  );

export const addVrtTrackBufferCommand = () =>
  Cypress.Commands.add(
    VRT_COMMAND_TRACK_BUFFER,
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
    VRT_COMMAND_TRACK_BASE64,
    {
      prevSubject: false,
    },
    (name, imageBase64, options) => {
      trackBase64(name, imageBase64, options).then((result) =>
        checkResult(result)
      );
    }
  );

/**
 * Add all Visual Tracker commands to Cypress namespace, so that these methods become available:
 * * `cy.vrtStart();`
 * * `cy.vrtStop();`
 * * `cy.vrtTrack();`
 * * `cy.vrtTrackBuffer();`
 * * `cy.vrtTrackBase64();`
 */
export const addVrtCommands = () => {
  addVrtStartCommand();
  addVrtStopCommand();
  addVrtTrackCommand();
  addVrtTrackBufferCommand();
  addVrtTrackBase64Command();
};
