import { beforeAll, describe, expect, it } from "vitest";
import { toTestRunDto } from "./utils";

beforeAll(() => {
  const config: Record<string, number> = {
    viewportWidth: 1000,
    viewportHeight: 660,
  };
  Object.assign(globalThis, {
    Cypress: {
      browser: { name: "chrome" },
      config: (key: string) => config[key],
    },
  });
});

describe("toTestRunDto", () => {
  it("passes every track option to sdk-js", () => {
    const options = {
      viewport: "800x600",
      os: "linux",
      device: "desktop",
      customTags: "smoke,dark",
      comment: "Logged out",
      diffTollerancePercent: 1,
      ignoreAreas: [{ x: 1, y: 2, width: 3, height: 4 }],
      keepScreenshot: true,
      retryLimit: 0,
    };

    expect(toTestRunDto({ name: "Home", options })).toEqual({
      name: "Home",
      browser: "chrome",
      ...options,
    });
  });

  it("takes the viewport from the Cypress config times the pixel ratio", () => {
    expect(toTestRunDto({ name: "Home", pixelRatio: 2, options: {} })).toMatchObject({
      viewport: "2000x1320",
    });
  });
});
