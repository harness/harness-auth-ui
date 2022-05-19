/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useEffect } from "react";
import cx from "classnames";
import google from "static/icons/google-white.svg";
import github from "static/icons/github.svg";
import css from "../SignUp.module.css";
import LargeOAuthButton from "./LargeOAuthButton";
import { getOAuthLink } from "components/AuthFooter/AuthFooter";
import {
  OAuthProviders,
  OAuthProviderType,
  OAUTH_PROVIDERS_BY_NAME_MAP
} from "interfaces/OAuthProviders";
import SecureStorage from "utils/SecureStorage";
import { getOAuthFinalUrl } from "utils/SignUpUtils";
import telemetry from "telemetry/Telemetry";
import { CATEGORY, EVENT } from "utils/TelemetryUtils";

const enabledOauthProviders = ["BITBUCKET", "GITLAB", "LINKEDIN", "AZURE"];
const SignupFormOAuth = ({
  changeFormType
}: {
  changeFormType: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}): React.ReactElement => {
  const accountId = SecureStorage.getItem("acctId") as string;

  const gotoAuth = (provider: OAuthProviderType) => {
    telemetry.track({
      event: EVENT.OAUTH_CLICKED,
      properties: {
        category: CATEGORY.SIGNUP,
        oauthProvider: provider.name
      }
    });
    const finalOauthURL = getOAuthFinalUrl(provider.url, accountId, true);
    window.location.href = finalOauthURL;
  };
  return (
    <div className={css.oAuthForm}>
      <LargeOAuthButton
        icon={google}
        iconClassName={css.buttonImage}
        text="Continue with Google"
        onClick={() => gotoAuth(OAUTH_PROVIDERS_BY_NAME_MAP.GOOGLE)}
      />
      <LargeOAuthButton
        icon={github}
        iconClassName={cx(css.buttonImage, css.iconInverse)}
        text="Continue with Github"
        onClick={() => gotoAuth(OAUTH_PROVIDERS_BY_NAME_MAP.GITHUB)}
      />
      <div
        className={cx(
          {
            "layout-horizontal spacing-auto": true,
            [css.fullButtons]: true
          },
          css.oAuthIcons,
          css.oAuthForm
        )}
      >
        {OAuthProviders.filter((provider) =>
          // if a list is provided, filter on that, otherwise show all
          enabledOauthProviders
            ? enabledOauthProviders.includes(provider.type)
            : true
        ).map((oAuthProvider: OAuthProviderType) =>
          getOAuthLink(true, oAuthProvider, accountId)
        )}
      </div>
      <h2 className={css.lineMessage}>
        <span className={css.message}>OR</span>
      </h2>
      <LargeOAuthButton
        onClick={changeFormType}
        icon={github}
        iconClassName={cx(css.buttonImage, css.iconInverse)}
        className={css.signupWithEmailButton}
        text="Sign up with Email"
      />
    </div>
  );
};
export default SignupFormOAuth;
