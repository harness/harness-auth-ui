import React from "react";
import cx from "classnames";
import {
  OAuthProviders,
  OAuthProviderType,
  URLS
} from "interfaces/OAuthProviders";

import css from "./AuthFooter.module.css";
import Icon from "components/Icon/Icon";

export enum AuthPage {
  SignIn,
  SignUp
}

interface AuthFooterProps {
  page: AuthPage;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ page }) => {
  return (
    <>
      <h2 className={css.lineMessage}>
        <span className={css.message}>
          {page === AuthPage.SignUp ? "or sign up with" : "or login with"}
        </span>
      </h2>

      <div>
        <div className={cx("layout-horizontal spacing-auto", css.oAuthIcons)}>
          {OAuthProviders.map((oAuthProvider: OAuthProviderType) => {
            const { iconName, type, url } = oAuthProvider;

            const link = `${URLS.OAUTH}api/users/${url}`;

            return (
              <a
                className={css.iconContainer}
                key={type}
                href={link}
                rel="noreferrer"
                target="_blank"
              >
                <Icon name={iconName} size={24} />
              </a>
            );
          })}
        </div>
        {page === AuthPage.SignUp ? (
          <div className={css.disclaimer}>
            disclaimer
            <a
              className={css.externalLink}
              href={URLS.PRIVACY_AGREEMENT}
              rel="noreferrer"
              target="_blank"
            >
              privacy
            </a>
            middle
            <a
              className={css.externalLink}
              href={URLS.SUBSCRIPTION_TERMS}
              rel="noreferrer"
              target="_blank"
            >
              terms
            </a>
          </div>
        ) : (
          <button className={cx("button", css.ssoButton)}>
            <Icon name="sso" size={24} className={css.icon} /> Single Sign-On
          </button>
        )}
      </div>
    </>
  );
};

export default AuthFooter;
