/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import { Link, useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import { Form } from "react-final-form";
import ReCAPTCHA from "react-google-recaptcha";

import RouteDefinitions from "RouteDefinitions";
import Field from "components/Field/Field";
import BasicLayout from "components/BasicLayout/BasicLayout";
import { useLogin } from "services/portal";

import logo from "static/images/harness-logo.svg";
import css from "./SignIn.module.css";
import AuthFooter, { AuthPage } from "components/AuthFooter/AuthFooter";
import { handleError } from "utils/ErrorUtils";
import { handleLoginSuccess } from "utils/LoginUtils";
import {
  validateEmail,
  validatePasswordRequiredOnly
} from "utils/FormValidationUtils";
import { useQueryParams } from "hooks/useQueryParams";
import { isCommunityPlan } from "utils/DeploymentTypeUtil";
import Spinner from "static/icons/spinner/Spinner";
import { useVanityExperience } from "hooks/useVanityExperience";
import PasswordField from "components/Field/PasswordField";

const createAuthToken = (email: string, password: string): string => {
  const encodedToken = btoa(email + ":" + password);
  return `Basic ${encodedToken}`;
};

interface LoginFormData {
  email: string;
  password: string;
}

export interface SignInQueryParams {
  returnUrl?: string;
  errorCode?: string;
  action?: "signout";
}

const SignIn: React.FC = () => {
  const { returnUrl, errorCode, action } = useQueryParams<SignInQueryParams>();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaReponse, setCaptchaResponse] = useState<string | undefined>();
  const {
    accountId,
    isVanity,
    hideUsernamePasswordForm,
    hideOauth,
    hideSSO,
    authenticationInfo,
    loading: loadingAuthInfo,
    error
  } = useVanityExperience();

  const { mutate: login, loading } = useLogin({});
  const captchaRef = useRef<ReCAPTCHA>(null);
  const history = useHistory();

  // this runs once on first mount
  useEffect(() => {
    if (returnUrl) {
      // save returnUrl for SAML flow
      sessionStorage.setItem("returnUrl", returnUrl);
    } else {
      // clearing sessionStorage in case previous login was cancelled
      sessionStorage.removeItem("returnUrl");
    }

    switch (errorCode) {
      case "GATEWAY_SSO_REDIRECT_ERROR":
        toast.error(
          "Unable to sign-in using OAuth because the account is not configured with OAuth authentication."
        );
        return;
      case "unauth": {
        const message = sessionStorage.getItem("NOT_WHITELISTED_IP_MESSAGE");
        if (message) {
          toast.error(message);
        } else {
          toast.error("Current IP Address is not whitelisted.");
        }
        sessionStorage.removeItem("NOT_WHITELISTED_IP_MESSAGE");
        return;
      }
      case "invalidsso":
        toast.error("Invalid SSO Login.");
        return;
      case "email_verify_fail":
        toast.error(
          "Email verification failed. Please sign in to resend the email."
        );
        return;
      case "INVITE_EXPIRED":
        toast.error(
          "This invitation URL has expired. Please request for a new invitation from your admin."
        );
        return;
      case "INVITE_INVALID":
        toast.error(
          "We couldn’t find an invitation matching the email address you entered. Please search your email for an invitation from Harness or contact your admin."
        );
        return;
    }
  }, []);

  const handleLogin = async (formData: LoginFormData) => {
    try {
      const response = await login(
        {
          authorization: createAuthToken(formData.email, formData.password)
        },
        {
          queryParams: {
            captcha: captchaReponse,
            accountId: accountId
          }
        }
      );
      handleLoginSuccess({
        resource: response?.resource,
        history,
        selectedAccount: accountId
      });
    } catch (error) {
      captchaRef.current?.reset();
      setCaptchaResponse(undefined);
      const errorCode = error.data?.responseMessages?.[0]?.code;
      if (errorCode === "MAX_FAILED_ATTEMPT_COUNT_EXCEEDED") {
        setShowCaptcha(true);
      }
      handleError(error);
    }
  };

  return (
    <BasicLayout>
      <div className={cx(css.signin)}>
        <div className={css.header}>
          <img src={logo} width={120} className={css.logo} alt={"Harness"} />
        </div>
        <div className={css.title}>Sign in</div>
        <div className={css.subtitle}>and get ship done.</div>
        {loadingAuthInfo ? (
          <div className={css.center}>
            <Spinner />
          </div>
        ) : (
          <>
            {!hideUsernamePasswordForm ? (
              <Form
                onSubmit={handleLogin}
                render={({ handleSubmit }) => {
                  return (
                    <form
                      className="layout-vertical spacing-medium"
                      onSubmit={handleSubmit}
                    >
                      <Field
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="email@work.com"
                        disabled={loading}
                        validate={validateEmail}
                      />
                      <div
                        className="layout-vertical spacing-small"
                        style={{ position: "relative" }}
                      >
                        <label htmlFor="password">Password</label>
                        <Link
                          to={RouteDefinitions.toForgotPassword()}
                          className={css.forgotLink}
                          tabIndex={-1}
                        >
                          Forgot password?
                        </Link>
                        <PasswordField
                          name="password"
                          disabled={loading}
                          validate={validatePasswordRequiredOnly}
                        />
                      </div>
                      {showCaptcha ? (
                        <ReCAPTCHA
                          sitekey={window.captchaToken || ""}
                          ref={captchaRef}
                          onChange={(token: string | null) => {
                            if (token) {
                              setCaptchaResponse(token);
                            }
                          }}
                        />
                      ) : null}
                      <input
                        type="submit"
                        value={loading ? "Signing in..." : "Sign in"}
                        className="button primary"
                        disabled={loading || (showCaptcha && !captchaReponse)}
                      />
                    </form>
                  );
                }}
              />
            ) : null}
            <AuthFooter
              page={AuthPage.SignIn}
              accountId={accountId}
              hideSeparator={hideUsernamePasswordForm}
              hideOAuth={isCommunityPlan() || hideOauth}
              hideSSO={isCommunityPlan() || hideSSO}
              isVanity={!!((accountId || isVanity) && !error)}
              enabledOauthProviders={
                (accountId || isVanity) && authenticationInfo
                  ? authenticationInfo?.oauthProviders
                  : undefined
              }
              ssoIdpUrl={authenticationInfo?.samlRedirectUrl}
              action={action}
            />
            {window.signupExposed === "true" || __DEV__ ? (
              <div className={css.footer}>
                No account?{" "}
                <Link to={RouteDefinitions.toSignUp()}>Sign up</Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </BasicLayout>
  );
};

export default SignIn;
