/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { FocusEvent, useState } from "react";
import cx from "classnames";
import AuthFooter, {
  AuthPage,
  OAuthLink
} from "components/AuthFooter/AuthFooter";
import Field from "components/Field/Field";
import PasswordField from "components/Field/PasswordField";
import ReCAPTCHA from "react-google-recaptcha";
import { handleError } from "utils/ErrorUtils";
import { Form } from "react-final-form";
import { validateEmail } from "utils/FormValidationUtils";
import { EVENT, CATEGORY } from "utils/TelemetryUtils";
import { useQueryParams } from "hooks/useQueryParams";
import telemetry from "telemetry/Telemetry";
import css from "../SignUp.module.css";
import { Link } from "react-router-dom";
import RouteDefinitions from "RouteDefinitions";
import { OAuthProviders, OAuthProviderType } from "interfaces/OAuthProviders";
import SecureStorage from "utils/SecureStorage";
import LargeOAuthButton from "./LargeOAuthButton";

interface SignUpFormData {
  email: string;
  password: string;
}
interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => void;
  loading: boolean;
  captchaExecuting: boolean;
  captchaRef: React.RefObject<ReCAPTCHA>;
  setCaptchaToken: (token: string | null) => void;
  handleRecaptchaError(): void;
}
const SignupFormWithCredentials = ({
  onSubmit,
  captchaExecuting,
  loading,
  captchaRef,
  setCaptchaToken,
  handleRecaptchaError
}: SignUpFormProps): React.ReactElement => {
  const accountId = SecureStorage.getItem("acctId") as string;
  const {
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
            utm_source: utm_source || "",
            utm_medium: utm_medium || "",
            utm_campaign: utm_campaign || "",
            utm_term: utm_term || "",
            utm_content: utm_content || ""
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
    />
  );

  return (
    <>
      <div
        className={cx(
          {
            "layout-horizontal spacing-auto": true
          },
          css.oAuthIcons,
          css.oAuthForm,
          css.allAuth,
          css.emailFormMargin
        )}
      >
        {OAuthProviders.map((oAuthProvider: OAuthProviderType) => (
          <OAuthLink
            key={oAuthProvider.name}
            isOauthSignup
            oAuthProvider={oAuthProvider}
            accountId={accountId}
          />
        ))}
      </div>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form
            className={cx(
              "layout-vertical spacing-medium ",
              css.credsFormInput
            )}
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
            <LargeOAuthButton
              disabled={loading || captchaExecuting}
              type="submit"
              iconClassName={cx(css.buttonImage, css.iconInverse)}
              text="Sign up "
            />
          </form>
        )}
      />
    </>
  );
};
export default SignupFormWithCredentials;
