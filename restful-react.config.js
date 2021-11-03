/**
 * Please match the config key to the directory under services.
 * This is required for the transform to work
 */

module.exports = {
  portal: {
    output: "src/services/portal/index.tsx",
    // url: "http://localhost:3457/api/swagger.json",
    file: "src/services/portal/swagger.json", // we are using file instead of url because "version" field is missing in actual response
    validation: false,
    transformer: "scripts/swagger-transform.js",
    customImport: `import { getConfig } from "../config";`,
    customProps: {
      base: `{getConfig("api")}`
    }
  },
  ng: {
    output: "src/services/ng/index.tsx",
    url: "https://qa.harness.io/prod1/ng/api/swagger.json",
    validation: false,
    transformer: "scripts/swagger-transform.js",
    customImport: `import { getConfig } from "../config";`,
    customProps: {
      base: `{getConfig("ng/api")}`
    }
  }
};
