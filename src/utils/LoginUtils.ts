/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import type { User } from "services/portal";
import SecureStorage from "./SecureStorage";
import RouteDefinitions from "RouteDefinitions";
import { History } from "history";
import { DefaultExperience } from "utils/DefaultExperienceTypes";
import telemetry from "telemetry/Telemetry";

interface AuthHeader {
  authorization: string;
}

interface HandleLoginSuccess {
  resource?: User;
  history: History;
  selectedAccount?: string; // coming from returnUrl
}

export function formatJWTHeader(authCode: string): AuthHeader {
  const token = window.btoa(
    `${SecureStorage.getItem("twoFactorJwtToken")}:${authCode}`
  );
  const header = {
    authorization: `JWT ${token}`
  };
  return header;
}

const accountIdExtractionRegex = /\/account\/([\w|-]+)\//;

export const getAccountIdFromUrl = (url?: string): string | undefined => {
  if (!url) return;
  const urlObject = new URL(url);
  const accountId = urlObject.hash?.match(accountIdExtractionRegex)?.[1];
  return accountId;
};

export function handleLoginSuccess({
  resource,
  history,
  selectedAccount
}: HandleLoginSuccess): void {
  const queryString = window.location.hash?.split("?")?.[1];
  const urlParams = new URLSearchParams(queryString);
  let returnUrl = urlParams?.get("returnUrl");
  if (!returnUrl) {
    returnUrl = sessionStorage.getItem("returnUrl");
    sessionStorage.removeItem("returnUrl");
  }
  const baseUrl = window.location.pathname.replace("auth/", "");

  if (resource) {
    const loginToAccountId =
      selectedAccount ||
      resource.defaultAccountId ||
      resource.accounts?.[0]?.uuid;

    SecureStorage.setItem("token", resource.token);
    SecureStorage.setItem("uuid", resource.uuid);
    SecureStorage.setItem("email", resource.email);
    SecureStorage.setItem("acctId", loginToAccountId);
    SecureStorage.setItem("lastTokenSetTime", new Date().getTime());

    // store `defaultExperience` to LocalStorage for root redirect in CGUI
    const account = resource.accounts?.find(
      (account) => account.uuid === loginToAccountId
    );
    if (account?.defaultExperience) {
      localStorage.setItem("defaultExperience", account?.defaultExperience);
    }

    // send identify user event to telemetry to update the identity
    if (resource.email) {
      telemetry.identify({ userId: resource.email });
    }

    if (
      resource.twoFactorAuthenticationEnabled === true &&
      resource.twoFactorJwtToken
    ) {
      SecureStorage.setItem("twoFactorJwtToken", resource.twoFactorJwtToken);
      history.push({
        pathname: RouteDefinitions.toTwoFactorAuth(),
        search: returnUrl ? `returnUrl=${returnUrl}` : undefined
      });
      return;
    }

    // Disabling this to avoid overloading LS with Harness Support usergroup accounts
    // https://harness.atlassian.net/browse/PL-20761
    // if (resource.accounts) createDefaultExperienceMap(resource.accounts);

    if (returnUrl) {
      try {
        const returnUrlObject = new URL(returnUrl);
        // only redirect to same hostname
        if (returnUrlObject.hostname === window.location.hostname) {
          // if returnUrl contains an accountId
          if (selectedAccount) {
            // if user has access to this accountId
            if (
              resource.accounts?.find(
                (account) => account.uuid === selectedAccount
              )
            ) {
              window.location.href = returnUrl;
              return;
            } else {
              // user doesn't have access to this accountId
              // clearing the SecureStorage and redirecting to signin without returnURL.
              SecureStorage.clear();
              history.replace(RouteDefinitions.toSignIn());
              return;
            }
          } else {
            // returnUrl doesn't contain accountId, free to follow
            window.location.href = returnUrl;
            return;
          }
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            `"${returnUrl}" is a not a valid redirect due to hostname mismatch`
          );
        }
      } catch (err) {
        // returnUrl is not a valid url. do nothing.
        // eslint-disable-next-line no-console
        console.warn(`"${returnUrl}" is not a valid URL`);
      }
    }

    const experience = resource.accounts?.find(
      (account) => account.uuid === loginToAccountId
    )?.defaultExperience;

    switch (experience) {
      case DefaultExperience.NG:
        window.location.href = `${baseUrl}ng/#/account/${loginToAccountId}`;
        return;
      case DefaultExperience.CG:
      default:
        window.location.href = `${baseUrl}#/account/${loginToAccountId}/dashboard`;
        return;
    }
  } else {
    // TODO: handle empty login response
  }
}
