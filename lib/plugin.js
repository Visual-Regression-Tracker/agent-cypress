import { readFileSync, unlinkSync } from "fs";
import { VisualRegressionTracker } from "@visual-regression-tracker/sdk-js";

export function addVisualRegressionTrackerPlugin(on, config) {
  const vrtConfig = config?.env?.visualRegressionTracker;
  let vrt = new VisualRegressionTracker(vrtConfig);

  on("task", {
    ["ENCODE_IMAGE"]: (props) => {
      const { imagePath } = props;
      const buffer = readFileSync(imagePath);
      const imageBase64 = buffer.toString("base64");
      unlinkSync(imagePath);
      return imageBase64;
    },
    ["VRT_START"]: async (props) => {
      try {
        if (!vrt["isStarted"]()) {
          await vrt.start();
        }
      } catch (err) {
        return err.message ? err.message : err;
      }
      return null;
    },
    ["VRT_STOP"]: async (props) => {
      try {
        if (vrt["isStarted"]()) {
          await vrt.stop();
        }
      } catch (err) {
        return err.message ? err.message : err;
      }
      return null;
    },
    ["VRT_TRACK_IMAGE"]: async (props) => {
      const {
        name,
        imageBase64,
        browser,
        pixelRatio,
        os,
        device,
        diffTollerancePercent,
        ignoreAreas,
      } = props;

      if (!imageBase64) {
        throw new Error("Image is missing or not encoded");
      }

      return vrt["submitTestResult"]({
        name,
        imageBase64,
        browser,
        viewport: `${config.viewportWidth * pixelRatio}x${
          config.viewportHeight * pixelRatio
        }`,
        os,
        device,
        diffTollerancePercent,
        ignoreAreas,
      });
    },
    ["VRT_PROCESS_ERROR_RESULT"]: async (testRunResult) => {
      vrt["processTestRun"](testRunResult);
      return null;
    },
  });
}
