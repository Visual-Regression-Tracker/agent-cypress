/* global cy */
/// <reference types="cypress" />
const vrtErrors=[];

function vrtTrack(name){
    cy.vrtTrack(name, null, (err) => {
        vrtErrors.push(err);
        return true;
    })
}

before(() => {
    cy.vrtStart();
});

after(() => {
    cy.vrtStop();
    expect(vrtErrors).to.have.length(2);
});

context("Error Callback", () => {
    beforeEach(() => {
        cy.visit("https://jestjs.io/");
    });

    it("should track several screenshots", () => {
        vrtTrack("Page with UI change 1");
        vrtTrack("Page with UI change 2");
    });
});
