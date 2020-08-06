/* global Cypress, cy */

export const addTrackCommand = () =>
  Cypress.Commands.add(
    "track",
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
            },
            { log: false }
          )
        )
        .then((err) => {
          if (err) {
            throw new Error(err);
          }
        });
    }
  );
