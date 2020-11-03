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

  interface TrackOptions {
    os?: string;
    device?: string;
    diffTollerancePercent?: number;
    ignoreAreas?: IgnoreArea[];
  }

  interface IgnoreArea {
    x: number;
    y: number;
    width: number;
    height: number;
  }
}
