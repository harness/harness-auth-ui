import type { UserInfo } from "services/ng";
import AppStorage from "utils/AppStorage";

export async function handleSignUpSuccess(resource?: UserInfo): Promise<void> {
  const baseUrl = window.location.pathname.replace("auth/", "");

  if (resource) {
    const intent = resource.intent;
    AppStorage.set("token", resource.token);
    AppStorage.set("uuid", resource.uuid);
    AppStorage.set("acctId", resource.defaultAccountId);
    AppStorage.set("lastTokenSetTime", +new Date());

    if (intent) {
      switch (intent.toUpperCase()) {
        case "CE":
          window.location.href = `${baseUrl}#/account/${resource.defaultAccountId}/continuous-efficiency/settings?source=signup`;
          break;
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
