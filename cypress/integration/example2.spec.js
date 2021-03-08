/* global cy */

context("Visual Regression Tracker2", () => {
  beforeEach(() => {
    cy.visit("/commands/location");
  });

  it("example2", () => {
    // cy.get("#navbar").should("be.visible");
    cy.vrtTrack("Whole page1");

    cy.vrtTrack("Whole page2", { retryLimit: 1 });

    cy.get("#navbar").vrtTrack("Separate element2");

    cy.vrtTrack("With additional options2", {
      os: "MacOS",
      device: "Cloud agent",
      diffTollerancePercent: 0,
    });
  });
});
