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
import { handleError } from "utils/ErrorUtils";
import { validateEmail, validatePassword } from "utils/FormValidationUtils";
import telemetry from "telemetry/Telemetry";
import { useQueryParams } from "hooks/useQueryParams";
import { VERIFY_EMAIL_STATUS } from "pages/VerifyEmail/VerifyEmailStatus";
import {
  BillingFrequency,
  Edition,
  SignupAction
} from "components/AuthFooter/AuthFooter";

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
          utmSource: utm_source,
          utmContent: utm_content,
          utmMedium: utm_medium,
          utmTerm: utm_term,
          utmCampaign: utm_campaign
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
        event: "Signup submit",
        properties: {
          category: "SIGNUP",
          userId: data.email,
          groupId: "",
          utm_source: utm_source || "",
          utm_medium: utm_medium || "",
          utm_campaign: utm_campaign || "",
          utm_term: utm_term || "",
          utm_content: utm_content || ""
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
            groupId: "",
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
      module: module || "",
      utm_source: utm_source || "",
      utm_medium: utm_medium || "",
      utm_campaign: utm_campaign || "",
      utm_term: utm_term || "",
      utm_content: utm_content || ""
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
        <AuthFooter page={AuthPage.SignUp} />
        <div className={css.footer}>
          Already have an account?{" "}
          <Link to={RouteDefinitions.toSignIn()}>Sign in</Link>
        </div>
      </div>
    </BasicLayout>
  );
};

export default SignUp;
