const fs = require("fs");
const VisualRegressionTracker = require("@visual-regression-tracker/sdk-js")
  .VisualRegressionTracker;

let vrt;

exports.addVisualRegressionTrackerPlugin = function (on, config) {
  on("task", {
    ["ENCODE_IMAGE"]: (props) => {
      const { imagePath } = props;
      const buffer = fs.readFileSync(imagePath);
      const imageBase64 = buffer.toString("base64");
      fs.unlinkSync(imagePath);
      return imageBase64;
    },
    ["TRACK_IMAGE"]: async (props) => {
      const {
        name,
        imageBase64,
        browser,
        pixelRatio,
        os,
        device,
        diffTollerancePercent,
      } = props;

      const vrtConfig = config?.env?.visualRegressionTracker;

      if (!imageBase64) {
        throw new Error("Image is missing or not encoded");
      }
      if (!vrt) {
        vrt = new VisualRegressionTracker(vrtConfig);
      }

      try {
        await vrt.track({
          name,
          imageBase64,
          browser,
          viewport: `${config.viewportWidth * pixelRatio}x${
            config.viewportHeight * pixelRatio
          }`,
          os,
          device,
          diffTollerancePercent,
        });
      } catch (err) {
        return err.message;
      }
      return null;
    },
  });
};
