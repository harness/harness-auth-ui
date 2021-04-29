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

export enum AuthPage {
  SignIn,
  SignUp
}

interface AuthFooterProps {
  page: AuthPage;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ page }) => {
  const history = useHistory();

  const isSignup = page === AuthPage.SignUp;

  return (
    <>
      <h2 className={css.lineMessage}>
        <span className={css.message}>
          {isSignup ? "or sign up with" : "or login with"}
        </span>
      </h2>

      <div>
        <div className={cx("layout-horizontal spacing-auto", css.oAuthIcons)}>
          {OAuthProviders.map((oAuthProvider: OAuthProviderType) => {
            const { iconName, type, url } = oAuthProvider;

            const signupQueryParams = "&action=signup&isNG=true";
            const link = `${URLS.OAUTH}api/users/${url}${
              isSignup ? signupQueryParams : ""
            }`;

            return (
              <a
                className={css.iconContainer}
                key={type}
                href={link}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon name={iconName} size={24} />
              </a>
            );
          })}
        </div>
        {isSignup ? (
          <div className={css.disclaimer}>
            By signing up you agree to our&nbsp;
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
                history.push(RouteDefinitions.toLocalLogin());
              }}
            >
              <Text>Harness Local Login</Text>
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default AuthFooter;
