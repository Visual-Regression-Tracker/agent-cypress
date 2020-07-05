export * from './commands'
export * from './vrt-plugin'

declare global {
    namespace Cypress {
        interface Chainable {
            track(name: string, options?: Partial<Loggable & Timeoutable & ScreenshotOptions & TrackOptions>): Chainable<null>
        }

        interface TrackOptions {
            os?: string;
            device?: string;
            diffTollerancePercent?: number;
        }
    }
}