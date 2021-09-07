import React from "react";
import cx from "classnames";
import { useHistory } from "react-router-dom";
import {
  OAuthProviders,
  OAuthProviderType,
  URLS
} from "interfaces/OAuthProviders";

import css from "./AuthFooter.module.css";
import Icon from "components/Icon/Icon";
import RouteDefinitions from "RouteDefinitions";
import Text from "components/Text/Text";
import { useQueryParams } from "hooks/useQueryParams";

export enum AuthPage {
  SignIn,
  SignUp
}

interface AuthFooterProps {
  page: AuthPage;
  hideOAuth?: boolean;
  accountId?: string;
}

const AuthFooter: React.FC<AuthFooterProps> = ({
  page,
  hideOAuth,
  accountId
}) => {
  const history = useHistory();
  const { returnUrl } = useQueryParams();
  const isSignup = page === AuthPage.SignUp;

  function getSignupQueryParams() {
    const queryString = window.location.hash?.split("?")?.[1];
    const urlParams = new URLSearchParams(queryString);
    const module = urlParams?.get("module");
    const moduleParam = module ? `&module=${module}` : "";

    return `&action=signup&isNG=true${moduleParam}`;
  }

  function getOAuthLink(
    isOauthSignup: boolean,
    oAuthProvider: OAuthProviderType
  ) {
    const { iconName, type, url } = oAuthProvider;
    const link = `${URLS.OAUTH}api/users/${url}${
      isOauthSignup
        ? getSignupQueryParams()
        : accountId
        ? `&accountId=${accountId}`
        : ""
    }`;

    return (
      <a className={css.iconContainer} key={type} href={link}>
        <Icon name={iconName} size={24} />
      </a>
    );
  }

  return (
    <>
      {hideOAuth === true ? null : (
        <>
          <h2 className={css.lineMessage}>
            <span className={css.message}>
              {isSignup ? "or sign up with" : "or login with"}
            </span>
          </h2>
          <div className={cx("layout-horizontal spacing-auto", css.oAuthIcons)}>
            {OAuthProviders.map((oAuthProvider: OAuthProviderType) =>
              getOAuthLink(isSignup, oAuthProvider)
            )}
          </div>
        </>
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
          <button
            className={cx("button", css.ssoButton)}
            onClick={() => {
              history.push(RouteDefinitions.toSSOSignIn());
            }}
          >
            <Text icon="sso" iconProps={{ size: 24 }}>
              Single Sign-On
            </Text>
          </button>
          <button
            className={cx("button", css.ssoButton)}
            onClick={() => {
              history.push({
                pathname: RouteDefinitions.toLocalLogin(),
                search: returnUrl
                  ? `returnUrl=${encodeURIComponent(returnUrl as string)}`
                  : void 0
              });
            }}
          >
            <Text>Harness Local Login</Text>
          </button>
        </>
      )}
    </>
  );
};

export default AuthFooter;
