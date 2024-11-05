const { defineConfig } = require("cypress");
const cypressOnFix = require("cypress-on-fix");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");
require(
  "dotenv"
  ).config();
const fs = require("fs-extra");
const path = require("path");

module.exports = defineConfig({
  e2e: {
    env: {
      ...process.env,
      tags:""
    },
    reporter: "cypress-mochawesome-reporter",
    specPattern: "cypress/e2e/features/*.feature",
    baseUrl:
      "https://operasyoninternetsubesitst.agesa.com.tr/maf-ui-dashboard-bff/#",
    chromeWebSecurity: false,
    viewportHeight: 800,
    viewportWidth: 1300,
    defaultCommandTimeout: 100000,
    pageLoadTimeout: 120000,
    requestTimeout: 90000,
    responseTimeout: 90000,
    testIsolation: false,
    screenshotsFolder: "cypress/screenshots",
    video: true,

    async setupNodeEvents(on, config) {
      // "cypress-on-fix" is required because "cypress-mochawesome-reporter" and "cypress-cucumber-preprocessor" use the same hooks
      on = cypressOnFix(on);

      require("cypress-mochawesome-reporter/plugin")(on);

      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      const envConfigFile = config.env.configFile || "default";
      const pathToConfigFile = path.resolve(
        "cypress/config",
        `${envConfigFile}.json`
      );

      if (fs.existsSync(pathToConfigFile)) {
        const fileConfig = await fs.readJson(pathToConfigFile);
        config.env = { ...config.env, ...fileConfig.env };
        config.custom = { ...config.custom, ...fileConfig };
      }

      return config;
    },
  },
});
