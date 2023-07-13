import { unlinkSync } from "fs";
import {
  VisualRegressionTracker,
} from "@visual-regression-tracker/sdk-js";

export function addVisualRegressionTrackerPlugin(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
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
    ["VRT_TRACK"]: async (props) => {
      try {
        return await vrt.track(props, props?.retryLimit);
      } catch (err) {
        return err.message ?? err;
      }
      finally{
        if (!props.keepScreenshot && props.imagePath) {
          unlinkSync(props.imagePath);
        }
      }
    }
  });
}
