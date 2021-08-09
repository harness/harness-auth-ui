/* eslint-disable @typescript-eslint/no-explicit-any */
declare interface Window {
  bugsnagClient: any;
  bugsnagToken: string;
  captchaToken: string;
  invisibleCaptchaToken: string;
  segmentToken: string;
  signupExposed: string;
  gtmCDEnabled: string;
}

declare const Bugsnag: any;
declare const __DEV__: boolean;
declare const __BUGSNAG_RELEASE_VERSION__: string;
