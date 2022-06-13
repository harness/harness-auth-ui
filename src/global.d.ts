/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare interface Window {
  bugsnagClient: any;
  bugsnagToken: string;
  captchaToken: string;
  invisibleCaptchaToken: string;
  segmentToken: string;
  signupExposed: string;
  deploymentType: DEPLOYMENT_TYPE;
  apiUrl: string;
  expectedHostname: string;
  oauthDisabled: string;
  isNewSignupEnabled: string;
}

declare enum DEPLOYMENT_TYPE {
  SAAS = "SAAS",
  ON_PREM = "ON_PREM",
  COMMUNITY = "COMMUNITY"
}

declare const Bugsnag: any;
declare const __DEV__: boolean;
declare const __BUGSNAG_RELEASE_VERSION__: string;
