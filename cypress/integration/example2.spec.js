/* global cy */

context("Visual Regression Tracker2", () => {
  beforeEach(() => {
    cy.visit("/commands/viewport");
  });

  it("example2", () => {
    cy.get("#navbar").should("be.visible");

    cy.vrtTrack("Whole page2");

    cy.get("#navbar").vrtTrack("Separate element2");

    cy.vrtTrack("With additional options2", {
      os: "MacOS",
      device: "Cloud agent",
      diffTollerancePercent: 0,
    });
  });
});
