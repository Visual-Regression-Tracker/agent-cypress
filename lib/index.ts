
/// <reference types="cypress" />

// typically custom commands are added in this support folder
// so it makes sense to put their TypeScript definitions here
// from the JavaScript specs loads this file using
// the triple slash "reference" comment like this:
//
// /// <reference path="../support/index.d.ts" />

declare namespace Cypress {
    interface Chainable {
        track(name: string, options?: Partial<Loggable & Timeoutable & ScreenshotOptions & TrackOptions>): Chainable<null>
    }

    interface TrackOptions {
        os?: string;
        viewport?: string;
        device?: string;
        diffTollerancePercent?: number;
    }
}