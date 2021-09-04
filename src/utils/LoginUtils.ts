import type { Account, User } from "services/portal";
import SecureStorage from "./SecureStorage";
import RouteDefinitions from "RouteDefinitions";
import { History } from "history";
import { DefaultExperience } from "utils/DefaultExperienceTypes";

interface AuthHeader {
  authorization: string;
}

interface HandleLoginSuccess {
  resource?: User;
  history: History;
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

export function createDefaultExperienceMap(accounts: Account[]): void {
  // create map of { accountId: defaultExperience } from accounts list and store in LS for root redirect
  const defaultExperienceMap = accounts.reduce((previousValue, account) => {
    return {
      ...previousValue,
      [account.uuid]: account.defaultExperience
    };
  }, {});
  SecureStorage.setItem("defaultExperienceMap", defaultExperienceMap);
}

const accountIdExtractionRegex = /\/account\/([\w|-]+)\//;

export function handleLoginSuccess({
  resource,
  history
}: HandleLoginSuccess): void {
  const queryString = window.location.hash?.split("?")?.[1];
  const urlParams = new URLSearchParams(queryString);
  let returnUrl = urlParams?.get("returnUrl");
  const baseUrl = window.location.pathname.replace("auth/", "");

  if (resource) {
    SecureStorage.setItem("token", resource.token);
    SecureStorage.setItem("uuid", resource.uuid);
    SecureStorage.setItem("acctId", resource.defaultAccountId);
    SecureStorage.setItem("lastTokenSetTime", new Date().getTime());

    if (
      resource.twoFactorAuthenticationEnabled === true &&
      resource.twoFactorJwtToken
    ) {
      // returnUrl can be used from sessionStorage for SSO + 2FA combination
      returnUrl =
        urlParams?.get("returnUrl") || sessionStorage?.getItem("returnUrl");
      sessionStorage?.removeItem("returnUrl");
      SecureStorage.setItem("twoFactorJwtToken", resource.twoFactorJwtToken);
      window.location.href = returnUrl
        ? `${baseUrl}auth/#/two-factor-auth?returnUrl=${returnUrl}`
        : `${baseUrl}auth/#/two-factor-auth`;
      return;
    }

    if (resource.accounts) createDefaultExperienceMap(resource.accounts);

    if (returnUrl) {
      sessionStorage?.removeItem("returnUrl");
      try {
        const returnUrlObject = new URL(returnUrl);
        // only redirect to same hostname
        if (returnUrlObject.hostname === window.location.hostname) {
          const accountId = returnUrlObject.hash?.match(
            accountIdExtractionRegex
          )?.[1];
          // if returnUrl contains an accountId
          if (accountId) {
            // if user has access to this accountId
            if (
              resource.accounts?.find((account) => account.uuid === accountId)
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
      (account) => account.uuid === resource.defaultAccountId
    )?.defaultExperience;

    switch (experience) {
      case DefaultExperience.NG:
        window.location.href = `${baseUrl}ng/#/account/${resource.defaultAccountId}`;
        return;
      case DefaultExperience.CG:
      default:
        window.location.href = `${baseUrl}#/account/${resource.defaultAccountId}/dashboard`;
        return;
    }
  } else {
    // TODO: handle empty login response
  }
}
