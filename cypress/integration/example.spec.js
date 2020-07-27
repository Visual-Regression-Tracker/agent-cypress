context("Visual Regression Tracker", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/viewport");
  });

  it("example", () => {
    cy.get("#navbar").should("be.visible");

    cy.track("Whole page");

    cy.get("#navbar").track("Separate element");

    cy.track("With additional options", {
      os: "MacOS",
      device: "Cloud agent",
      diffTollerancePercent: 0,
    });
  });
});
