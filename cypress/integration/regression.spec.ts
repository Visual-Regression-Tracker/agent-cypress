/// <reference types="cypress" />
/// <reference types="../../dist" />

import { TestRunResponse, TestStatus } from "@visual-regression-tracker/sdk-js";
import * as utils from "../../lib/utils";

const testRunResponce: TestRunResponse = {
  id: "someId",
  imageName: "imageName",
  diffName: "diffName",
  baselineName: "baselineName",
  diffPercent: 1.11,
  diffTollerancePercent: 2.22,
  pixelMisMatchCount: 3,
  status: TestStatus.unresolved,
  url: "url",
  merge: true,
};

describe("Regression suite", () => {
  describe("trackWithRetry", () => {
    it("should stop on condition", () => {
      utils.trackWithRetry(
        cy.stub().as("trackFn").resolves(testRunResponce),
        cy.stub().as("shouldStopFn").returns(true),
        cy.stub().as("checkResult")
      );

      cy.get("@trackFn").should("have.callCount", 1);
      cy.get("@shouldStopFn").should("have.callCount", 1);
      cy.get("@checkResult").should("have.callCount", 1);
    });

    it("should stop on default retry limit", () => {
      utils.trackWithRetry(
        cy.stub().as("trackFn").resolves(testRunResponce),
        cy.stub().as("shouldStopFn").returns(false),
        cy.stub().as("checkResult")
      );

      cy.get("@trackFn").should("have.been.calledThrice");
      cy.get("@shouldStopFn").should("have.been.calledTwice");
      cy.get("@checkResult").should("have.been.calledOnce");
    });

    it("should stop on custom retry limit", () => {
      utils.trackWithRetry(
        cy.stub().as("trackFn").resolves(testRunResponce),
        cy.stub().as("shouldStopFn").returns(false),
        cy.stub().as("checkResult"),
        5
      );

      cy.get("@trackFn").should("have.callCount", 6);
    });
  });

  describe("shouldStopRetry", () => {
    it("should continue", () => {
      expect(
        utils.shouldStopRetry({
          ...testRunResponce,
          status: TestStatus.unresolved,
        })
      ).to.be.false;
    });
    it("should stop", () => {
      expect(
        utils.shouldStopRetry({
          ...testRunResponce,
          status: TestStatus.ok,
        })
      ).to.be.true;
      expect(
        utils.shouldStopRetry({
          ...testRunResponce,
          status: TestStatus.new,
        })
      ).to.be.true;
    });
  });
});
