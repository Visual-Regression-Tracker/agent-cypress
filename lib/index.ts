declare namespace Cypress {
  interface Chainable {
    vrtTrack(
      name: string,
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
    os?: string;
    device?: string;
    diffTollerancePercent?: number;
    ignoreAreas?: IgnoreArea[];
    retryLimit?: number;
  }
}
