/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

// https://vitejs.dev/config/

import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import emitEJS from "rollup-plugin-emit-ejs";
import htmlPlugin from "vite-plugin-html-config";
import { version } from "./package.json";
import replace from "@rollup/plugin-replace";
import { BugsnagSourceMapUploaderPlugin } from "vite-plugin-bugsnag";

const DEV = process.env.NODE_ENV === "development";
const BUGSNAG_TOKEN = process.env.BUGSNAG_TOKEN;

const uploadSourceMap = BUGSNAG_TOKEN && !DEV;

let headScripts = [];
if (!DEV) {
  headScripts = [
    {
      src: "//d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js"
    },
    `
    if(!window.deploymentType)
    window.deploymentType="COMMUNITY"
    `
  ];
} else {
  headScripts = [
    `
    if(!window.deploymentType)
    window.deploymentType="SAAS"
  `
  ];
}

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3457",
        changeOrigin: true
      },
      "/gateway/ng/api": {
        target: "http://localhost:7457",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gateway\/ng\/api/, "")
      }
    }
  },
  build: {
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      moduleDirectories: ["node_modules", "src"],
      extensions: [".js", ".ts", ".tsx"]
    }),
    htmlPlugin({
      headScripts
    }),
    replace({
      __DEV__: DEV,
      __BUGSNAG_RELEASE_VERSION__: JSON.stringify(version)
    }),
    emitEJS({
      src: ".",
      data: {
        version,
        gitCommit: process.env.GIT_COMMIT,
        gitBranch: process.env.GIT_BRANCH
      }
    }),
    ...(uploadSourceMap
      ? [
          BugsnagSourceMapUploaderPlugin({
            apiKey: BUGSNAG_TOKEN,
            appVersion: version,
            base: "*"
          })
        ]
      : [])
  ],
  base: ""
});
