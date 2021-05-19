import type { UserInfo } from "services/ng";
import AppStorage from "utils/AppStorage";

export function handleSignUpSuccess(resource?: UserInfo): void {
  const queryString = window.location.hash?.split("?")?.[1];
  const urlParams = new URLSearchParams(queryString);
  const module = urlParams?.get("module");
  const baseUrl = window.location.pathname.replace("auth/", "");

  if (resource) {
    AppStorage.set("token", resource.token);
    AppStorage.set("uuid", resource.uuid);
    AppStorage.set("acctId", resource.defaultAccountId);
    AppStorage.set("lastTokenSetTime", +new Date());

    if (module) {
      window.location.href = `${baseUrl}ng/#/account/${resource.defaultAccountId}/${module}/home/trial?source=signup`;
    } else {
      window.location.href = `${baseUrl}ng/#/account/${resource.defaultAccountId}/purpose?source=signup`;
    }
  }
}
