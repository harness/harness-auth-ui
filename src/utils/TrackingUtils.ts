/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */
import { getCookieByName } from "./SignUpUtils";

export function getUTMInfoParams(urlParams?: URLSearchParams): string {
  const utmCampaign =
    urlParams?.get("utm_campaign") || getCookieByName("utm_campaign");
  const utmCampaignParam = utmCampaign ? `&utm_campaign=${utmCampaign}` : "";

  const utmSource =
    urlParams?.get("utm_source") || getCookieByName("utm_source");
  const utmSourceParam = utmSource ? `&utm_source=${utmSource}` : "";

  const utmTerm = urlParams?.get("utm_term") || getCookieByName("utm_term");
  const utmTermParam = utmTerm ? `&utm_term=${utmTerm}` : "";

  const utmContent =
    urlParams?.get("utm_content") || getCookieByName("utm_content");
  const utmContentParam = utmContent ? `&utm_content=${utmContent}` : "";

  const utmMedium =
    urlParams?.get("utm_medium") || getCookieByName("utm_medium");
  const utmMediumParam = utmMedium ? `&utm_medium=${utmMedium}` : "";

  return `${utmCampaignParam}${utmSourceParam}${utmTermParam}${utmContentParam}${utmMediumParam}`;
}
