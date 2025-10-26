import { get } from "lodash-es";
import chai from "chai";
import chaiSubset from "chai-subset";
chai.use(chaiSubset);
const { expect } = chai;
import allure from "@wdio/allure-reporter";
import { logger } from "@sergey/core";

class Response {
  constructor(res) {
    this.res = res;
    this.logResponse();
  }

  async logResponse() {
    const logMessage = `---RESPONSE---
    Status: ${this.res.status}
    Body: ${JSON.stringify(this.res.body, null, 2)}
    `;
    const allureMessage = `Status of Response: ${this.res.status}`;
    // allure.startStep(allureMessage);
    logger.info(logMessage);
  }

  async performAssertionWithLogging(assertion, logMessage) {
    try {
      // allure.startStep(logMessage);
      logger.info(logMessage);

      await assertion();

      // allure.endStep("passed");
    } catch (error) {
      logger.error(error.message);
      // allure.endStep("failed");
      throw error;
    }
  }

  async verifyStatus(status) {
    const logMessage = `Comparing actual status: '${this.res.status}' to expected: '${status}'`;

    await this.performAssertionWithLogging(async () => {
      expect(this.res.status).to.equal(status);
    }, logMessage);
  }

  async verifyPropertyValue(propertyPath, expectedValue) {
    const actualValue = get(this.res.body, propertyPath);
    const message = `Verifying that property '${propertyPath}' has value '${expectedValue}', actual: '${actualValue}'`;

    await this.performAssertionWithLogging(async () => {
      expect(actualValue).to.equal(expectedValue);
    }, message);
  }

  async checkThatBodyContains(expectedObject) {
    const actualBody = this.res.body;
    const message = `Checking if response body includes expected object
      actual: ${JSON.stringify(actualBody, null, 2)}
      expected: ${JSON.stringify(expectedObject, null, 2)}`;

    await this.performAssertionWithLogging(async () => {
      expect(actualBody).to.containSubset(expectedObject);
    }, message);
  }

  async verifyPropertyIncludes(propertyPath, expectedSubstring) {
    const actualValue = get(this.res.body, propertyPath);
    const message = `Checking if '${propertyPath}' includes '${expectedSubstring}'`;

    await this.performAssertionWithLogging(async () => {
      expect(actualValue).to.include(expectedSubstring);
    }, message);
  }

  async verifyPropertyGreaterThan(propertyPath, expectedNumber) {
    const actualValue = get(this.res.body, propertyPath);
    const message = `Checking if '${propertyPath}' (${actualValue}) > ${expectedNumber}`;

    await this.performAssertionWithLogging(async () => {
      expect(actualValue).to.be.greaterThan(expectedNumber);
    }, message);
  }

  async verifyPropertyLessThan(propertyPath, expectedNumber) {
    const actualValue = get(this.res.body, propertyPath);
    const message = `Checking that '${propertyPath}' (${actualValue}) < ${expectedNumber}`;

    await this.performAssertionWithLogging(async () => {
      expect(actualValue).to.be.lessThan(expectedNumber);
    }, message);
  }

  async verifyPropertyType(propertyPath, expectedType) {
    const actualValue = get(this.res.body, propertyPath);
    const message = `Checking type of '${propertyPath}' is '${expectedType}'`;

    await this.performAssertionWithLogging(async () => {
      expect(actualValue).to.be.a(expectedType);
    }, message);
  }
  async verifyPropertyExists(propertyPath) {
    const actualValue = get(this.res.body, propertyPath);
    const message = `Checking that property '${propertyPath}' exists in the response`;

    await this.performAssertionWithLogging(async () => {
      expect(actualValue).to.not.be.undefined;
      expect(actualValue).to.not.be.null;
    }, message);
  }
  async verifyKeysInArray(arrayPath, keys) {
    const array = get(this.res.body, arrayPath);
    const message = `Checking that each item in '${arrayPath}' contains keys: [${keys.join(", ")}]`;

    await this.performAssertionWithLogging(async () => {
      array.forEach((item) => {
        keys.forEach((key) => {
          expect(item).to.have.property(key);
        });
      });
    }, message);
  }

  async expectTimestampToBeRecent(timestamp, toleranceMs = 5000) {
    const actualTime = new Date(timestamp).getTime();
    const now = Date.now();

    expect(actualTime).to.be.closeTo(
      now,
      toleranceMs,
      `Expected timestamp "${timestamp}" to be within ${toleranceMs}ms of now`
    );
  }
}
export default Response;
