import { get } from "lodash-es";
import chai from "chai";
import chaiSubset from "chai-subset";
chai.use(chaiSubset);
const { expect } = chai;
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
    logger.info(logMessage);
  }

  async verifyStatus(status) {
    logger.info(`Comparing actual status: '${this.res.status}' to expected: '${status}'`);
    expect(this.res.status).to.equal(status);
  }

  async verifyPropertyValue(propertyPath, expectedValue) {
    const actualValue = get(this.res.body, propertyPath);
    logger.info(
      `Verifying that property '${propertyPath}' has value '${expectedValue}', actual: '${actualValue}'`
    );

    expect(actualValue).to.equal(expectedValue);
  }

  async checkThatBodyContains(expectedObject) {
    const actualBody = this.res.body;
    logger.info(`Checking if response body includes expected object
      actual: ${JSON.stringify(actualBody, null, 2)}
      expected: ${JSON.stringify(expectedObject, null, 2)}`);

    expect(actualBody).to.containSubset(expectedObject);
  }

  async verifyPropertyIncludes(propertyPath, expectedSubstring) {
    const actualValue = get(this.res.body, propertyPath);
    logger.info(`Checking if '${propertyPath}' includes '${expectedSubstring}'`);

    expect(actualValue).to.include(expectedSubstring);
  }

  async verifyPropertyGreaterThan(propertyPath, expectedNumber) {
    const actualValue = get(this.res.body, propertyPath);
    logger.info(`Checking if '${propertyPath}' (${actualValue}) > ${expectedNumber}`);

    expect(actualValue).to.be.greaterThan(expectedNumber);
  }

  async verifyPropertyLessThan(propertyPath, expectedNumber) {
    const actualValue = get(this.res.body, propertyPath);
    logger.info(`Checking that '${propertyPath}' (${actualValue}) < ${expectedNumber}`);

    expect(actualValue).to.be.lessThan(expectedNumber);
  }

  async verifyPropertyType(propertyPath, expectedType) {
    const actualValue = get(this.res.body, propertyPath);
    logger.info(`Checking type of '${propertyPath}' is '${expectedType}'`);

    expect(actualValue).to.be.a(expectedType);
  }
  async verifyPropertyExists(propertyPath) {
    const actualValue = get(this.res.body, propertyPath);
    logger.info(`Checking that property '${propertyPath}' exists in the response`);

    expect(actualValue).to.not.be.undefined;
    expect(actualValue).to.not.be.null;
  }
  async verifyKeysInArray(arrayPath, keys) {
    const array = get(this.res.body, arrayPath);
    logger.info(`Checking that each item in '${arrayPath}' contains keys: [${keys.join(", ")}]`);

    array.forEach((item) => {
      keys.forEach((key) => {
        expect(item).to.have.property(key);
      });
    });
  }

  async expectTimestampToBeRecent(toleranceMs = 5000) {
    const actualTime = new Date(this.res.body.updatedAt).getTime();
    const now = Date.now();

    expect(actualTime).to.be.closeTo(
      now,
      toleranceMs,
      `Expected UpdateAt "${actualTime}" to be within ${toleranceMs}ms of now`
    );
  }
}
export default Response;
