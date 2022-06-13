/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useEffect, useRef } from "react";
import cx from "classnames";
import { useHistory } from "react-router-dom";
import {
  OAuthProvider,
  OAuthProviders,
  OAuthProviderType,
  URLS
} from "interfaces/OAuthProviders";
import { getSignupQueryParams } from "utils/SignUpUtils";
import { CATEGORY, EVENT } from "utils/TelemetryUtils";
import telemetry from "telemetry/Telemetry";

import css from "./AuthFooter.module.css";
import Icon from "components/Icon/Icon";
import RouteDefinitions from "RouteDefinitions";
import Text from "components/Text/Text";
import Spinner from "static/icons/spinner/Spinner";

export enum AuthPage {
  SignIn,
  SignUp
}

interface AuthFooterProps {
  page: AuthPage;
  hideOAuth?: boolean;
  accountId?: string;
  hideSSO?: boolean;
  hideSeparator?: boolean;
  enabledOauthProviders?: OAuthProvider[];
  isVanity?: boolean;
  ssoIdpUrl?: string;
  action?: "signout";
}

export function getOAuthLink(
  isOauthSignup: boolean,
  oAuthProvider: OAuthProviderType,
  accountId?: string,
  showFullOauthButtons?: boolean
): React.ReactElement {
  const { iconName, type, url } = oAuthProvider;
  const link = `${URLS.OAUTH}api/users/${url}${
    isOauthSignup
      ? getSignupQueryParams()
      : accountId
      ? `&accountId=${accountId}`
      : ""
  }`;

  const oAuthClicked = useRef(false);
  const category = isOauthSignup ? CATEGORY.SIGNUP : CATEGORY.SIGNIN;

  useEffect(() => {
    const listener = () => {
      if (oAuthClicked.current) {
        telemetry.track({
          event: EVENT.OAUTH_CLICKED,
          properties: {
            category,
            oauthProvider: oAuthProvider.name
          }
        });
      }
    };

    window.addEventListener("beforeunload", listener);

    return () => window.removeEventListener("beforeunload", listener);
  }, []);

  return (
    <a
      className={cx(css.iconContainer, "oauthbutton")}
      key={type}
      href={link}
      onClick={() => {
        oAuthClicked.current = true;
      }}
    >
      <Icon name={iconName} size={24} className={css.icon} />
      {showFullOauthButtons ? (
        <span className={css.name}>{oAuthProvider.name}</span>
      ) : (
        ""
      )}
    </a>
  );
}

const AuthFooter: React.FC<AuthFooterProps> = (props) => {
  const {
    page,
    hideOAuth,
    accountId,
    hideSSO,
    hideSeparator,
    enabledOauthProviders,
    isVanity,
    ssoIdpUrl,
    action
  } = props;
  const history = useHistory();
  const isSignup = page === AuthPage.SignUp;
  const showFullOauthButtons =
    enabledOauthProviders && enabledOauthProviders.length <= 4;

  return (
    <>
      {hideSeparator || (hideOAuth && hideSSO) ? null : (
        <h2 className={css.lineMessage}>
          <span className={css.message}>
            {isSignup ? "or sign up with" : "or login with"}
          </span>
        </h2>
      )}
      {hideOAuth ? null : (
        <div
          className={cx(
            {
              "layout-horizontal spacing-auto": !showFullOauthButtons,
              "layout-vertical spacing-medium": showFullOauthButtons,
              [css.fullButtons]: showFullOauthButtons
            },
            css.oAuthIcons
          )}
        >
          {OAuthProviders.filter((provider) =>
            // if a list is provided, filter on that, otherwise show all
            enabledOauthProviders
              ? enabledOauthProviders.includes(provider.type)
              : true
          ).map((oAuthProvider: OAuthProviderType) =>
            getOAuthLink(
              isSignup,
              oAuthProvider,
              accountId,
              showFullOauthButtons
            )
          )}
        </div>
      )}
      {isSignup ? (
        <div className={css.disclaimer}>
          By signing up, you agree to our&nbsp;
          <a
            className={css.externalLink}
            href={URLS.PRIVACY_AGREEMENT}
            rel="noreferrer"
            target="_blank"
          >
            Privacy Policy&nbsp;
          </a>
          and our&nbsp;
          <a
            className={css.externalLink}
            href={URLS.SUBSCRIPTION_TERMS}
            rel="noreferrer"
            target="_blank"
          >
            Terms of Use
          </a>
        </div>
      ) : (
        <>
          {hideSSO ? null : isVanity && action !== "signout" ? (
            <div className={css.center}>
              <Spinner />
            </div>
          ) : (
            <button
              className={cx("button", css.ssoButton)}
              onClick={() => {
                if (ssoIdpUrl) {
                  window.location.href = ssoIdpUrl;
                } else {
                  history.push(RouteDefinitions.toSSOSignIn());
                }
              }}
            >
              <Text icon="sso" iconProps={{ size: 24 }}>
                Single sign-on
              </Text>
            </button>
          )}
        </>
      )}
    </>
  );
};

export default AuthFooter;
