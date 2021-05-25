import { unlinkSync } from "fs";
import { VisualRegressionTracker } from "@visual-regression-tracker/sdk-js";

export function addVisualRegressionTrackerPlugin(on, config) {
  const vrtConfig = config?.env?.visualRegressionTracker;
  let vrt = new VisualRegressionTracker(vrtConfig);

  on("task", {
    ["VRT_START"]: async (props) => {
      try {
        if (!vrt["isStarted"]()) {
          await vrt.start();
        }
      } catch (err) {
        return err.message ?? err;
      }
      return null;
    },
    ["VRT_STOP"]: async (props) => {
      try {
        if (vrt["isStarted"]()) {
          await vrt.stop();
        }
      } catch (err) {
        return err.message ?? err;
      }
      return null;
    },
    ["VRT_TRACK_IMAGE_MULTIPART"]: async (props) => {
      const {
        name,
        imagePath,
        browser,
        viewport,
        os,
        device,
        diffTollerancePercent,
        ignoreAreas,
      } = props;

      const result = await vrt["submitTestRunMultipart"]({
        name,
        imagePath,
        browser,
        viewport,
        os,
        device,
        diffTollerancePercent,
        ignoreAreas,
      });

      unlinkSync(imagePath);
      return result;
    },
    ["VRT_PROCESS_ERROR_RESULT"]: async (testRunResult) => {
      try {
        vrt["processTestRun"](testRunResult);
      } catch (err) {
        return err.message ?? err;
      }
      return null;
    },
  });
}
