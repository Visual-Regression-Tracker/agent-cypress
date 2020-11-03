/* global Cypress, cy */

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
            throw new Error(err);
          }
        })
        .then(() =>
          Cypress.log({
            name: "Visual Regression Tracker",
            displayName: "VRT",
            message: "Started",
          })
        );
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
            throw new Error(err);
          }
        })
        .then(() =>
          Cypress.log({
            name: "Visual Regression Tracker",
            displayName: "VRT",
            message: "Stopped",
          })
        );
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
      let imagePath: string;
      let pixelRatio: number;
      const target = subject ? cy.wrap(subject) : cy;

      target
        .screenshot(name, {
          ...options,
          onAfterScreenshot: (el, props) => {
            imagePath = props.path;
            pixelRatio = props.pixelRatio;
            return options?.onAfterScreenshot;
          },
        })
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
        )
        .then((err) => {
          if (err) {
            throw new Error(err);
          }
        })
        .then(() =>
          Cypress.log({
            name: "Visual Regression Tracker",
            displayName: "VRT",
            message: `tracked ${name}`,
          })
        );
    }
  );
