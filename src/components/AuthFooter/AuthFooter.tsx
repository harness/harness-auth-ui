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

export enum SignupAction {
  REGULAR = "REGULAR",
  TRIAL = "TRIAL",
  SUBSCRIBE = "SUBSCRIBE"
}

export enum Edition {
  FREE = "FREE",
  TEAM = "TEAM",
  ENTERPRISE = "ENTERPRISE"
}

export enum BillingFrequency {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY"
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

  function getLicenseParams(urlParams?: URLSearchParams): string {
    const signupAction = urlParams?.get("signupAction");
    const signupParam =
      signupAction && signupAction.toUpperCase() in SignupAction
        ? `&signupAction=${signupAction.toUpperCase()}`
        : "";

    const edition = urlParams?.get("edition");
    const editionParam =
      edition && edition.toUpperCase() in Edition
        ? `&edition=${edition.toUpperCase()}`
        : "";

    const billingFrequency = urlParams?.get("billingFrequency");
    const billingFrequencyParam =
      billingFrequency && billingFrequency.toUpperCase() in BillingFrequency
        ? `&billingFrequency=${billingFrequency.toUpperCase()}`
        : "";

    return `${signupParam}${editionParam}${billingFrequencyParam}`;
  }

  function getUTMInfoParams(urlParams?: URLSearchParams): string {
    const utmCampaign = urlParams?.get("utm_campaign");
    const utmCampaignParam = utmCampaign ? `&utm_campaign=${utmCampaign}` : "";

    const utmSource = urlParams?.get("utm_source");
    const utmSourceParam = utmSource ? `&utm_source=${utmSource}` : "";

    const utmTerm = urlParams?.get("utm_term");
    const utmTermParam = utmTerm ? `&utm_term=${utmTerm}` : "";

    const utmContent = urlParams?.get("utm_content");
    const utmContentParam = utmContent ? `&utm_content=${utmContent}` : "";

    const utmMedium = urlParams?.get("utm_medium");
    const utmMediumParam = utmMedium ? `&utm_medium=${utmMedium}` : "";

    return `${utmCampaignParam}${utmSourceParam}${utmTermParam}${utmContentParam}${utmMediumParam}`;
  }

  function getSignupQueryParams() {
    const queryString = window.location.hash?.split("?")?.[1];
    const urlParams = new URLSearchParams(queryString);

    const module = urlParams?.get("module");
    const moduleParam = module ? `&module=${module}` : "";

    const licenseParams = getLicenseParams(urlParams);

    const utmInfoParams = getUTMInfoParams(urlParams);

    return `&action=signup&isNG=true${moduleParam}${licenseParams}${utmInfoParams}`;
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
              Single sign-on
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
            <Text>Harness local login</Text>
          </button>
        </>
      )}
    </>
  );
};

export default AuthFooter;
