import React, { useEffect, useRef, useState, FocusEvent } from "react";
import cx from "classnames";
import { Link } from "react-router-dom";
import { Form } from "react-final-form";
import ReCAPTCHA from "react-google-recaptcha";

import BasicLayout from "components/BasicLayout/BasicLayout";
import { useCreateSignupInvite } from "services/ng";

import logo from "static/images/harness-logo.svg";
import css from "./SignUp.module.css";
import RouteDefinitions from "RouteDefinitions";
import AuthFooter, { AuthPage } from "components/AuthFooter/AuthFooter";
import Field from "components/Field/Field";
import { handleError } from "utils/ErrorUtils";
import { validateEmail, validatePassword } from "utils/FormValidationUtils";
import telemetry from "telemetry/Telemetry";
import { useQueryParams } from "hooks/useQueryParams";

interface SignUpFormData {
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [signupData, setSignupData] = useState({ email: "", password: "" });
  const { mutate: signup, loading } = useCreateSignupInvite({});
  const captchaRef = useRef<ReCAPTCHA>(null);
  const { module } = useQueryParams<{ module?: string }>();

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
    try {
      await signup(
        {
          ...data,
          intent: module
        },
        {
          queryParams: { captchaToken: captchaToken }
        }
      );

      // TODO: reroute to UI screens when complete
    } catch (error) {
      captchaRef.current?.reset();

      if (
        error?.data?.responseMessages[0]?.code === "USER_ALREADY_REGISTERED"
      ) {
        // TODO: route the user to the "already signed up" page
      }

      handleError(error);
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
        event: "Signup submit",
        properties: {
          category: "SIGNUP",
          userId: data.email,
          groupId: ""
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
          event: "Email input",
          properties: {
            category: "SIGNUP",
            userId: e.target.value,
            groupId: ""
          }
        });
      }}
    />
  );

  const passwordField = (
    <Field
      name="password"
      label="Password"
      type="password"
      placeholder="Password"
      disabled={loading || captchaExecuting}
      validate={validatePassword}
    />
  );

  telemetry.page({
    name: "Signup Page",
    category: "SIGNUP",
    properties: {
      userId: "",
      groupId: "",
      module: module || ""
    }
  });

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
        <div className={css.title}>Sign Up</div>
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
                value="Sign Up"
                className="button primary"
                disabled={loading || captchaExecuting}
              />
            </form>
          )}
        />
        <AuthFooter page={AuthPage.SignUp} />
        <div className={css.footer}>
          Already have an account?{" "}
          <Link to={RouteDefinitions.toSignIn()}>Sign In</Link>
        </div>
      </div>
    </BasicLayout>
  );
};

export default SignUp;
