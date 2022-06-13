/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

export const isCommunityPlan = (): boolean =>
  window.deploymentType === "COMMUNITY";

export const isOnPrem = (): boolean => window.deploymentType === "ON_PREM";

export const isSaas = (): boolean => window.deploymentType === "SAAS";
export const isNewSignupEnabled = (): boolean =>
  window.isNewSignupEnabled === "true";
