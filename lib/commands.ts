import { VisualRegressionTracker } from '@visual-regression-tracker/sdk-js'

let vrt: VisualRegressionTracker;
const config = Cypress.config();
const { vrt_config } = Cypress.env()

export const addTrackCommand = () => Cypress.Commands.add("track", {
    prevSubject: ['optional', 'element', 'window', 'document'],
}, (subject, name, options,) => {
    let imagePath: string;
    const target = subject ? cy.wrap(subject) : cy;
    return target.screenshot(name,
        {
            ...options,
            onAfterScreenshot: (el, props) => {
                imagePath = props.path
                return options?.onAfterScreenshot
            }
        })
        .then(() => cy.task("ENCODE_IMAGE", { imagePath }, { log: false }))
        .then((imageBase64) => {
            if (imageBase64 === undefined) { throw new Error("Image is missing or not encoded") }
            if (!vrt) {
                vrt = new VisualRegressionTracker(vrt_config)
            }
            return vrt.track({
                name,
                imageBase64: imageBase64 || "",
                browser: Cypress.browser.name,
                viewport: options?.viewport || `${config.viewportWidth}x${config.viewportHeight}`,
                os: options?.os,
                device: options?.device,
                diffTollerancePercent: options?.diffTollerancePercent
            })
        })
})