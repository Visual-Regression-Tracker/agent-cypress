declare namespace Cypress {
    interface Chainable {
        track(name: string, options?: Partial<Loggable & Timeoutable & ScreenshotOptions & TrackOptions>): Chainable<null>
    }

    interface TrackOptions {
        os?: string;
        device?: string;
        diffTollerancePercent?: number;
    }
}