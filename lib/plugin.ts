import { unlinkSync } from "fs";
import {
  VisualRegressionTracker,
} from "@visual-regression-tracker/sdk-js";
import {VRT_START, VRT_STOP, VRT_TRACK, VRT_IS_STARTED} from "./utils";

export function addVisualRegressionTrackerPlugin(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
  const vrtConfig = config?.env?.visualRegressionTracker;
  let vrt = new VisualRegressionTracker(vrtConfig);

  on("task", {
    [VRT_START]: async (props) => {
      try {
        if (!vrt[VRT_IS_STARTED]()) {
          await vrt.start();
        }
      } catch (err) {
        return (err as Error).message ?? err;
      }
      return null;
    },
    [VRT_STOP]: async (props) => {
      try {
        if (vrt[VRT_IS_STARTED]()) {
          await vrt.stop();
        }
      } catch (err) {
        return (err as Error).message ?? err;
      }
      return null;
    },
    [VRT_TRACK]: async (props) => {
      try {
        return await vrt.track(props, props?.retryLimit);
      } catch (err) {
        return (err as Error).message ?? err;
      }
      finally{
        if (!props.keepScreenshot && props.imagePath) {
          unlinkSync(props.imagePath);
        }
      }
    }
  });
}
