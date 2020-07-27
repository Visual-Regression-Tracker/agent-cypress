/* global Cypress, cy */
import { VisualRegressionTracker } from "@visual-regression-tracker/sdk-js";

let vrt: VisualRegressionTracker;
const { visualRegressionTracker } = Cypress.env();

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
      return target
        .screenshot(name, {
          ...options,
          onAfterScreenshot: (el, props) => {
            imagePath = props.path;
            pixelRatio = props.pixelRatio;
            return options?.onAfterScreenshot;
          },
        })
        .then(() => cy.task("ENCODE_IMAGE", { imagePath }, { log: false }))
        .then((imageBase64) => {
          if (!imageBase64) {
            throw new Error("Image is missing or not encoded");
          }
          if (!vrt) {
            vrt = new VisualRegressionTracker(visualRegressionTracker);
          }
          const config = Cypress.config();
          return vrt.track({
            name,
            imageBase64: imageBase64 || "",
            browser: Cypress.browser.name,
            viewport: `${config.viewportWidth * pixelRatio}x${
              config.viewportHeight * pixelRatio
            }`,
            os: options?.os,
            device: options?.device,
            diffTollerancePercent: options?.diffTollerancePercent,
          });
        });
    }
  );
