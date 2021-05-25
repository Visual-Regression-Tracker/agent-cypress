/* global cy */

before(() => {
  cy.vrtStart();
});

after(() => {
  cy.vrtStop();
});

context("Visual Regression Tracker", () => {
  beforeEach(() => {
    cy.visit("/commands/viewport");
  });

  it("example", () => {
    cy.get("#navbar").should("be.visible");

    cy.vrtTrack("Whole page");

    cy.get("#navbar").vrtTrack("Separate element", {
      ignoreAreas: [
        {
          x: 1,
          y: 1,
          width: 600,
          height: 50,
        },
      ],
    });

    cy.vrtTrack("With additional options", {
      os: "MacOS",
      device: "Cloud agent",
      diffTollerancePercent: 0,
      ignoreAreas: [
        {
          x: 0,
          y: 0,
          width: 300,
          height: 300,
        },
      ],
    });
  });
});
