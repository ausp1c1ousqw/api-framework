import { logger } from "@sergey/core";

const hooks = {
  beforeScenario: async function (world) {
    logger.info(`Scenario started: ${world.pickle.name}`);
  },

  beforeStep: async function (step) {
    logger.info(`Step: ${step.text}`);
  },

  afterStep: async function (step, scenario, { error }) {
    logger.info(`Step ended: ${step.text}`);

    if (error) {
      logger.error(error);
    }
    const stepLogs = logger.getFullLogs();
    allure.addAttachment(`Logs for: ${step.text}`, stepLogs, "text/plain");

    logger.clear();
  },

  afterScenario: async function (world, result) {
    logger.info(`=== End Scenario: ${world.pickle.name} ===`);
  },
};
export default hooks;
