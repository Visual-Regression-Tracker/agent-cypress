module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // cypress/ holds Cypress e2e specs, which need the Cypress runner
  roots: ["<rootDir>/lib"],
};
