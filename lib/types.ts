/* global Cypress, cy */
//export { }

declare namespace Cypress {
  interface Chainable {
    /**
     * Validate image against baseline
     * @param name Image identifier.
     * @param options An object that contains one or more additional properties.
     *
     * @example
     *    cy.vrtTrack("name")
     *    cy.get("#id").vrtTrack("name", {
     *       os: "MacOS",
     *       device: "Cloud agent",
     *       customTags: "Cloud, DarkTheme, Auth",
     *       diffTollerancePercent: 1.23,
     *       ignoreAreas: [
     *         {x: 1, y: 2, width: 100, height: 200}
     *       ],
     *       retryLimit: 5,
     *       keepScreenshot: false,
     *    })
     */
    vrtTrack(
      name: string,
      options?: Partial<
        Loggable &
          Timeoutable &
          ScreenshotOptions &
          TrackOptions & { keepScreenshot?: boolean }
      >,
      errorCallback?: (err: string) => boolean
    ): Chainable<null>;

    vrtTrackBuffer(
      name: string,
      imageBuffer: Buffer,
      options?: Partial<
        Loggable & Timeoutable & ScreenshotOptions & TrackOptions
      >
    ): Chainable<null>;

    vrtTrackBase64(
      name: string,
      imageBase64: string,
      options?: Partial<
        Loggable & Timeoutable & ScreenshotOptions & TrackOptions
      >
    ): Chainable<null>;

    vrtStart(): null;

    vrtStop(): null;
  }

  interface IgnoreArea {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  interface TrackOptions {
    viewport?: string;
    os?: string;
    device?: string;
    customTags?: string;
    diffTollerancePercent?: number;
    ignoreAreas?: IgnoreArea[];
    retryLimit?: number;
  }
}
