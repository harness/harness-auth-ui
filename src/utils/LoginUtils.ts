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

export const getAccountIdFromUrl = (url: string): string | undefined => {
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
  const returnUrl = urlParams?.get("returnUrl");
  const baseUrl = window.location.pathname.replace("auth/", "");

  if (resource) {
    const loginToAccountId =
      selectedAccount ||
      resource.defaultAccountId ||
      resource.accounts?.[0]?.uuid;
    SecureStorage.setItem("token", resource.token);
    SecureStorage.setItem("uuid", resource.uuid);
    SecureStorage.setItem("acctId", loginToAccountId);
    SecureStorage.setItem("lastTokenSetTime", new Date().getTime());

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

    if (resource.accounts) createDefaultExperienceMap(resource.accounts);

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
