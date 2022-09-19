import { unlinkSync } from "fs";
import {
  VisualRegressionTracker,
  multipartDtoToFormData,
  bufferDtoToFormData,
} from "@visual-regression-tracker/sdk-js";

// We can't utilize Cypress Logger in tasks
reportError = (errorMessage) => {
  console.error(`Visual Regresssion Tracker: ${errorMessage}`);
}
log = (message ) => {
  console.log(`Visual Regression Tracker: ${message}`);
}

export function addVisualRegressionTrackerPlugin(on, config) {
  const vrtConfig = config?.env?.visualRegressionTracker;
  let vrt = new VisualRegressionTracker(vrtConfig);
  
  on("before:run", async () => {
    try {
      await vrt.start();
    } catch (err) {
      reportError(`Error during startup: ${err.message ?? err}`);
    }
  },
  on("after:run", async () => {
    try {
      await vrt.stop();
    } catch (err) {
      reportError(`Error when trying to stop: ${err.message ?? err}`);
    }
  },
  on("task", {
    ["VRT_TRACK_IMAGE_MULTIPART"]: async (props) => {
      const data = multipartDtoToFormData({
        ...props,
        buildId: vrt.buildId,
        projectId: vrt.projectId,
        branchName: vrt.config.branchName,
      });

      const result = await vrt["submitTestRunMultipart"](data);

      if (!props.keepScreenshot) {
        unlinkSync(props.imagePath);
      }
      return result;
    },
    ["VRT_TRACK_BUFFER_MULTIPART"]: async (props) => {
      const data = bufferDtoToFormData({
        ...props,
        buildId: vrt.buildId,
        projectId: vrt.projectId,
        branchName: vrt.config.branchName,
      });

      const result = await vrt["submitTestRunMultipart"](data);
      return result;
    },
    ["VRT_TRACK_IMAGE_BASE64"]: async (props) => {
      const result = await vrt["submitTestRunBase64"](props);
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
