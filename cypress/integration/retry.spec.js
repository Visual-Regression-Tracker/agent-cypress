/* global cy */

context("Visual Regression Tracker2", () => {
  beforeEach(() => {
    cy.viewport("macbook-16");
    cy.visit("https://jestjs.io/");
  });

  it("example2", () => {
    cy.get(".jest-card-run").vrtTrack("card");
  });
});
