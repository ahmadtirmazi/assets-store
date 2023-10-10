/** @type {import('ts-jest').JestConfigWithTsJest} */

// import { compilerOptions } from "./tsconfig.json";
// import config from "./jest.config";

// const { pathsToModuleNameMapper } = require("ts-jest");
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.integration.test.ts"],
};
