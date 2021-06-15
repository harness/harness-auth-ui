import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

import RouteDefinitions from "RouteDefinitions";
import BasicLayout from "components/BasicLayout/BasicLayout";
import AuthFooter, { AuthPage } from "components/AuthFooter/AuthFooter";

import logo from "static/images/harness-logo.svg";
import css from "./SignIn.module.css";

const SignIn: React.FC = () => {
  const [captchaReponse, setCaptchaResponse] = useState("");
  const captchaRef = useRef<ReCAPTCHA>(null);
  const baseUrl = window.location.pathname.replace("/auth", "");

  const queryString = window.location.hash?.split("?")?.[1];
  const urlParams = new URLSearchParams(queryString);

  const errorCode = urlParams.get("errorCode");
  const captchaEnabled = errorCode === "MAX_FAILED_ATTEMPT_COUNT_EXCEEDED";

  useEffect(() => {
    switch (errorCode) {
      case "GATEWAY_SSO_REDIRECT_ERROR":
        toast.error(
          "Unable to sign-in using OAuth because the account is not configured with OAuth authentication."
        );
        return;
      case "unauth":
        toast.error("Current IP Address is not whitelisted.");
        return;
      case "invalidsso":
        toast.error("Invalid SSO Login.");
        return;
      case "INVALID_CREDENTIALS":
        toast.error("Your email or password is incorrect.");
        return;
    }
  }, [errorCode]);

  return (
    <BasicLayout>
      <div className={cx(css.signin)}>
        <div className={css.header}>
          <img src={logo} width={120} className={css.logo} />
        </div>
        <div className={css.title}>Sign In</div>
        <div className={css.subtitle}>and get ship done.</div>
        <form
          className="layout-vertical spacing-medium"
          action={`${baseUrl}gateway/api/users/new-login`}
          method="POST"
        >
          <div className="layout-vertical spacing-small">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              id="email"
              placeholder="email@work.com"
            />
          </div>
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
              Forgot Password?
            </Link>
            <input
              name="password"
              id="password"
              type="password"
              placeholder="Password"
            />
          </div>
          {captchaEnabled ? (
            <>
              <ReCAPTCHA
                sitekey={window.captchaToken || "1234"}
                ref={captchaRef}
                onChange={(token: string | null) => {
                  if (token) {
                    setCaptchaResponse(token);
                  }
                }}
              />
              <input
                type="hidden"
                name="captcha"
                id="captcha"
                value={captchaReponse}
              />
            </>
          ) : null}
          <input type="submit" value={"Sign In"} className="button primary" />
        </form>
        <AuthFooter page={AuthPage.SignIn} />
        <div className={css.footer}>
          No account? <Link to={RouteDefinitions.toSignUp()}>Sign Up</Link>
        </div>
      </div>
    </BasicLayout>
  );
};

export default SignIn;
