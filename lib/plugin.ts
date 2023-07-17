import { unlinkSync } from "fs";
import { VisualRegressionTracker } from "@visual-regression-tracker/sdk-js";
import {
  VRT_TASK_START,
  VRT_TASK_STOP,
  VRT_TASK_TRACK,
  VRT_IS_STARTED,
} from "./utils";

/**
 * Register task event handlers for Cypress.
 * @param on
 * @param config
 * @see https://docs.cypress.io/api/commands/task
 */
export function addVisualRegressionTrackerPlugin(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) {
  const vrtConfig = config?.env?.visualRegressionTracker;
  const vrt = new VisualRegressionTracker(vrtConfig);
  console.log("How come?");

  on("task", {
    [VRT_TASK_START]: async (props) => {
      try {
        if (!vrt[VRT_IS_STARTED]()) {
          await vrt.start();
        }
      } catch (err) {
        return (err as Error).message ?? err;
      }
      return null;
    },
    [VRT_TASK_STOP]: async (props) => {
      try {
        if (vrt[VRT_IS_STARTED]()) {
          await vrt.stop();
        }
      } catch (err) {
        return (err as Error).message ?? err;
      }
      return null;
    },
    [VRT_TASK_TRACK]: async (props) => {
      try {
        return await vrt.track(props, props?.retryLimit);
      } catch (err) {
        return (err as Error).message ?? err;
      } finally {
        if (!props.keepScreenshot && props.imagePath) {
          unlinkSync(props.imagePath);
        }
      }
    },
  });
}
