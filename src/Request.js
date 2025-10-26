import supertest from "supertest";
import allure from "@wdio/allure-reporter";
import { logger } from "@sergey/core";

class Request {
  constructor(baseApi, headers, responseWrapper) {
    this.request = supertest(baseApi);
    this.headers = headers;
    this.responseWrapper = responseWrapper;
  }

  async performRequestWithLogging(request, method, endpoint, headers, body = {}) {
    const logMessage = `--Request--
    Method: ${method}
    Endpoint: ${endpoint} 
    Headers: ${JSON.stringify(headers, null, 2)}
    Body: ${JSON.stringify(body, null, 2)}`;
    const allureMessage = `${method} request with endpoint: ${endpoint}`;
    try {
      // allure.startStep(allureMessage);
      logger.info(logMessage);

      const res = await request();

      // allure.endStep("passed");
      return new this.responseWrapper(res);
    } catch (error) {
      logger.error(error.message);
      // allure.endStep("failed");
      throw error;
    }
  }

  async get(endpoint, headers = {}) {
    const combinedHeaders = { ...this.headers, ...headers };
    return await this.performRequestWithLogging(
      async () => {
        return this.request.get(endpoint).set(combinedHeaders);
      },
      "GET",
      endpoint,
      headers
    );
  }

  async post(endpoint, body, headers = {}) {
    const combinedHeaders = { ...this.headers, ...headers };
    return await this.performRequestWithLogging(
      async () => {
        return this.request.post(endpoint).set(combinedHeaders).send(body);
      },
      "POST",
      endpoint,
      headers,
      body
    );
  }

  async put(endpoint, body, headers = {}) {
    const combinedHeaders = { ...this.headers, ...headers };
    return await this.performRequestWithLogging(
      async () => {
        return this.request.put(endpoint).set(combinedHeaders).send(body);
      },
      "PUT",
      endpoint,
      headers,
      body
    );
  }

  async patch(endpoint, body, headers = {}) {
    const combinedHeaders = { ...this.headers, ...headers };
    return await this.performRequestWithLogging(
      async () => {
        return this.request.patch(endpoint).set(combinedHeaders).send(body);
      },
      "PATCH",
      endpoint,
      headers,
      body
    );
  }

  async delete(endpoint, headers = {}) {
    const combinedHeaders = { ...this.headers, ...headers };
    return await this.performRequestWithLogging(
      async () => {
        return this.request.delete(endpoint).set(combinedHeaders);
      },
      "DELETE",
      endpoint,
      headers
    );
  }
}
export default Request;
