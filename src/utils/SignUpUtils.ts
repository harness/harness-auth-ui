import type { UserInfo } from "services/ng";
import SecureStorage from "./SecureStorage";

export async function handleSignUpSuccess(resource?: UserInfo): Promise<void> {
  const baseUrl = window.location.pathname.replace("auth/", "");

  if (resource) {
    const intent = resource.intent;
    SecureStorage.setItem("token", resource.token);
    SecureStorage.setItem("uuid", resource.uuid);
    SecureStorage.setItem("acctId", resource.defaultAccountId);
    SecureStorage.setItem("lastTokenSetTime", new Date().getTime());

    if (intent) {
      switch (intent.toUpperCase()) {
        case "CD":
          window.location.href = `${baseUrl}#/account/${resource.defaultAccountId}/onboarding`;
          break;
        default:
          window.location.href = `${baseUrl}ng/#/account/${resource.defaultAccountId}/${intent}/home?source=signup`;
          break;
      }
    } else {
      window.location.href = `${baseUrl}ng/#/account/${resource.defaultAccountId}/purpose?source=signup`;
    }
  }
}
