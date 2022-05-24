/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useEffect, useRef, useState, FocusEvent } from "react";
import cx from "classnames";
import { Link, useHistory } from "react-router-dom";
import { Form } from "react-final-form";
import ReCAPTCHA from "react-google-recaptcha";

import BasicLayout from "components/BasicLayout/BasicLayout";
import { useSignup, SignupDTO } from "services/ng";

import logo from "static/images/harness-logo.svg";
import css from "./SignUp.module.css";
import RouteDefinitions from "RouteDefinitions";
import AuthFooter, { AuthPage } from "components/AuthFooter/AuthFooter";
import Field from "components/Field/Field";
import PasswordField from "components/Field/PasswordField";
import { handleError } from "utils/ErrorUtils";
import { validateEmail } from "utils/FormValidationUtils";
import telemetry from "telemetry/Telemetry";
import { useQueryParams } from "hooks/useQueryParams";
import { VERIFY_EMAIL_STATUS } from "pages/VerifyEmail/VerifyEmailStatus";
import { BillingFrequency, Edition, SignupAction } from "utils/SignUpUtils";
import { CATEGORY, PAGE, EVENT } from "utils/TelemetryUtils";
import { getCookieByName } from "utils/SignUpUtils";

interface SignUpFormData {
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const history = useHistory();
  const [signupData, setSignupData] = useState({ email: "", password: "" });
  const { mutate: signup, loading } = useSignup({});
  const captchaRef = useRef<ReCAPTCHA>(null);
  const {
    module,
    signupAction,
    edition,
    billingFrequency,
    utm_source,
    utm_content,
    utm_medium,
    utm_term,
    utm_campaign
  } = useQueryParams<{
    module?: string;
    signupAction?: string;
    edition?: string;
    billingFrequency?: string;
    utm_source?: string;
    utm_content?: string;
    utm_medium?: string;
    utm_term?: string;
    utm_campaign?: string;
  }>();

  const utmCampaign = utm_campaign || getCookieByName("utm_campaign") || "";
  const utmSource = utm_source || getCookieByName("utm_source") || "";
  const utmContent = utm_content || getCookieByName("utm_content") || "";
  const utmMedium = utm_medium || getCookieByName("utm_medium") || "";
  const utmTerm = utm_term || getCookieByName("utm_term") || "";

  const [captchaExecuting, setCaptchaExecuting] = useState(false);
  useEffect(() => {
    const { email, password } = signupData;

    if (email && password && captchaToken) {
      setCaptchaExecuting(false);
      handleSignup(signupData, captchaToken);
    }
  }, [captchaToken]);

  const handleSignup = async (
    data: SignUpFormData,
    captchaToken: string
  ): Promise<void> => {
    const encodedEmail = encodeURIComponent(data.email);
    try {
      const signupRequestData: SignupDTO = {
        ...data,
        intent: module,
        utmInfo: {
          utmSource,
          utmContent,
          utmMedium,
          utmTerm,
          utmCampaign
        }
      };

      if (signupAction && signupAction.toUpperCase() in SignupAction) {
        signupRequestData.signupAction = signupAction.toUpperCase() as SignupAction;
      }

      if (edition && edition.toUpperCase() in Edition) {
        signupRequestData.edition = edition.toUpperCase() as Edition;
      }

      if (
        billingFrequency &&
        billingFrequency.toUpperCase() in BillingFrequency
      ) {
        signupRequestData.billingFrequency = billingFrequency.toUpperCase() as BillingFrequency;
      }

      await signup(signupRequestData, {
        queryParams: { captchaToken: captchaToken }
      });

      history.push({
        pathname: RouteDefinitions.toEmailVerification(),
        search: `?status=${VERIFY_EMAIL_STATUS.EMAIL_SENT}&email=${encodedEmail}`
      });
    } catch (error) {
      captchaRef.current?.reset();

      if (
        error?.data?.responseMessages?.length &&
        error?.data?.responseMessages[0]?.code === "USER_ALREADY_REGISTERED"
      ) {
        history.push({
          pathname: RouteDefinitions.toEmailVerification(),
          search: `?status=${VERIFY_EMAIL_STATUS.SIGNED_UP}&email=${encodedEmail}`
        });
      } else {
        handleError(error);
      }
    }
  };

  const manuallyExcecuteRecaptcha = (): boolean => {
    if (captchaRef.current?.execute) {
      captchaRef.current.execute();
      setCaptchaExecuting(true);
      return true;
    }

    handleError("Captcha failed to execute");
    return false;
  };

  const onSubmit = (data: SignUpFormData) => {
    if (manuallyExcecuteRecaptcha()) {
      data.email = data.email.toLowerCase();
      setSignupData(data);
      telemetry.track({
        event: EVENT.SIGNUP_SUBMIT,
        properties: {
          intent: module || "",
          category: CATEGORY.SIGNUP,
          userId: data.email,
          groupId: data.email,
          utm_source: utmSource,
          utm_content: utmContent,
          utm_medium: utmMedium,
          utm_term: utmTerm,
          utm_campaign: utmCampaign
        }
      });
    }
  };

  const emailField = (
    <Field
      name="email"
      label={"Email"}
      placeholder="email@work.com"
      disabled={loading || captchaExecuting}
      validate={validateEmail}
      onBlur={(e: FocusEvent<HTMLInputElement>) => {
        telemetry.track({
          event: EVENT.EMAIL_INPUT,
          properties: {
            category: CATEGORY.SIGNUP,
            email: e.target.value,
            utm_source: utmSource,
            utm_content: utmContent,
            utm_medium: utmMedium,
            utm_term: utmTerm,
            utm_campaign: utmCampaign
          }
        });
      }}
    />
  );

  const passwordField = (
    <PasswordField
      name="password"
      label="Password"
      placeholder="Password"
      disabled={loading || captchaExecuting}
      infoMessage={"The password must be between 8 and 64 characters long"}
    />
  );

  useEffect(() => {
    if (telemetry.initialized) {
      telemetry.page({
        name: PAGE.SIGNUP_PAGE,
        properties: {
          intent: module || "",
          utm_source: utmSource,
          utm_content: utmContent,
          utm_medium: utmMedium,
          utm_term: utmTerm,
          utm_campaign: utmCampaign
        }
      });
    }
  }, [telemetry.initialized]);

  function handleRecaptchaError() {
    // Block the user until they refresh
    setCaptchaExecuting(true);
    handleError("Captcha has failed, please refresh the page.");
  }

  return (
    <BasicLayout>
      <div className={cx(css.signup)}>
        <div className={css.header}>
          <img src={logo} width={120} className={css.logo} />
        </div>
        <div className={css.title}>Sign up</div>
        <div className={css.subtitle}>and get ship done.</div>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form
              className="layout-vertical spacing-medium"
              onSubmit={handleSubmit}
            >
              {emailField}
              {passwordField}
              <ReCAPTCHA
                ref={captchaRef}
                sitekey={
                  window.invisibleCaptchaToken ||
                  "6LfMgvcaAAAAAHCctQKV5AsCYZJHsKOpGH5oGc5Q" // site key for dev environments
                }
                size="invisible"
                onChange={setCaptchaToken}
                onErrored={handleRecaptchaError}
              />
              <input
                type="submit"
                value="Sign up"
                className="button primary"
                disabled={loading || captchaExecuting}
              />
            </form>
          )}
        />
        <AuthFooter
          page={AuthPage.SignUp}
          hideOAuth={window.oauthDisabled === "true"}
        />
        <div className={css.footer}>
          Already have an account?{" "}
          <Link to={RouteDefinitions.toSignIn()}>Sign in</Link>
        </div>
      </div>
    </BasicLayout>
  );
};

export default SignUp;
